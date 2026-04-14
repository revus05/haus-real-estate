import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

function requireAdmin(req: Request) {
  if (req.headers.get("x-user-role") !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function GET(req: Request) {
  const guard = requireAdmin(req)
  if (guard) return guard

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      _count: { select: { properties: true, leads: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ users })
}

export async function PATCH(req: Request) {
  const guard = requireAdmin(req)
  if (guard) return guard

  const body = await req.json()
  const schema = z.object({
    id: z.string().cuid(),
    role: z.enum(["USER", "REALTOR", "ADMIN"]),
  })
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.id },
    data: { role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json({ user })
}

export async function DELETE(req: Request) {
  const guard = requireAdmin(req)
  if (guard) return guard

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
