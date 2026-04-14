import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const statusSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "DONE"]),
})

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
  const lead = await prisma.lead.findUnique({ where: { id } })

  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Only the realtor assigned to the lead or admin can update it
  if (lead.realtorId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = statusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: { status: parsed.data.status },
  })

  return NextResponse.json({ lead: updated })
}
