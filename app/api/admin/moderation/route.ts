import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function PATCH(req: Request) {
  if (req.headers.get("x-user-role") !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const schema = z.object({
    id: z.string().cuid(),
    moderationStatus: z.enum(["PENDING", "PUBLISHED", "REJECTED"]),
  })
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const property = await prisma.property.update({
    where: { id: parsed.data.id },
    data: { moderationStatus: parsed.data.moderationStatus },
    select: { id: true, title: true, moderationStatus: true },
  })

  return NextResponse.json({ property })
}

export async function GET(req: Request) {
  if (req.headers.get("x-user-role") !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const status = new URL(req.url).searchParams.get("status") ?? "PENDING"
  const properties = await prisma.property.findMany({
    where: { moderationStatus: status as "PENDING" | "PUBLISHED" | "REJECTED" },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ properties })
}
