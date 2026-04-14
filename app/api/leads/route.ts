import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { leadSchema } from "@/lib/validations/lead"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = leadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { propertyId, name, contact, message } = parsed.data

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        contact,
        message,
        propertyId,
        realtorId: property.ownerId,
      },
    })

    return NextResponse.json({ lead }, { status: 201 })
  } catch (err) {
    console.error("[leads POST]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
