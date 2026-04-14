import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { propertySchema } from "@/lib/validations/property"
import type { Prisma } from "@/lib/generated/prisma/client"

const PAGE_SIZE = 12

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const dealType = searchParams.get("dealType")
  const propertyType = searchParams.get("propertyType")
  const city = searchParams.get("city")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const rooms = searchParams.get("rooms")
  const minArea = searchParams.get("minArea")
  const maxArea = searchParams.get("maxArea")
  const sort = searchParams.get("sort") ?? "date_desc"
  const q = searchParams.get("q")
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))

  const where: Prisma.PropertyWhereInput = {
    moderationStatus: "PUBLISHED",
  }

  if (dealType === "SALE" || dealType === "RENT") where.dealType = dealType
  if (
    propertyType &&
    ["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "LAND", "TOWNHOUSE"].includes(
      propertyType
    )
  ) {
    where.propertyType = propertyType as Prisma.EnumPropertyTypeFilter["equals"]
  }
  if (city) where.city = { contains: city, mode: "insensitive" }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = minPrice
    if (maxPrice) where.price.lte = maxPrice
  }
  if (rooms) where.rooms = parseInt(rooms, 10)
  if (minArea || maxArea) {
    where.area = {}
    if (minArea) where.area.gte = minArea
    if (maxArea) where.area.lte = maxArea
  }
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ]
  }

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "views_desc"
          ? { viewCount: "desc" }
          : { createdAt: "desc" }

  const [total, data] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        owner: { select: { id: true, name: true, avatarUrl: true, phone: true } },
      },
    }),
  ])

  return NextResponse.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / PAGE_SIZE),
    pageSize: PAGE_SIZE,
  })
}

export async function POST(req: Request) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = propertySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const property = await prisma.property.create({
      data: { ...parsed.data, ownerId: userId, moderationStatus: "PUBLISHED" },
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (err) {
    console.error("[properties POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
