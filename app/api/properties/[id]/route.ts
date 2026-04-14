import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { propertySchema } from "@/lib/validations/property"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
        },
      },
    },
  })

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Increment view count (fire-and-forget, don't await)
  prisma.property.update({ where: { id }, data: { viewCount: { increment: 1 } } })

  return NextResponse.json({ property })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id")
  const userRole = req.headers.get("x-user-role")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const property = await prisma.property.findUnique({ where: { id } })

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (property.ownerId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const parsed = propertySchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const updated = await prisma.property.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ property: updated })
  } catch (err) {
    console.error("[properties PATCH]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id")
  const userRole = req.headers.get("x-user-role")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const property = await prisma.property.findUnique({ where: { id } })

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (property.ownerId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.property.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
