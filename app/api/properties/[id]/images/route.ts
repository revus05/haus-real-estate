import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { uploadImage, deleteImage } from "@/lib/upload/cloudinary"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const property = await prisma.property.findUnique({ where: { id } })

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const userRole = req.headers.get("x-user-role")
  if (property.ownerId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File size must be under 5 MB" },
      { status: 400 }
    )
  }

  // Get current max order
  const lastImage = await prisma.propertyImage.findFirst({
    where: { propertyId: id },
    orderBy: { order: "desc" },
  })
  const nextOrder = (lastImage?.order ?? -1) + 1

  const { url, cloudinaryId } = await uploadImage(file)
  const image = await prisma.propertyImage.create({
    data: {
      url,
      cloudinaryId,
      propertyId: id,
      order: nextOrder,
      altText: formData.get("altText") as string | null,
    },
  })

  return NextResponse.json({ image }, { status: 201 })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = req.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: propertyId } = await params
  const { imageId } = await req.json()

  const image = await prisma.propertyImage.findUnique({ where: { id: imageId } })
  if (!image || image.propertyId !== propertyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const property = await prisma.property.findUnique({ where: { id: propertyId } })
  const userRole = req.headers.get("x-user-role")
  if (property?.ownerId !== userId && userRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await deleteImage(image.cloudinaryId)
  await prisma.propertyImage.delete({ where: { id: imageId } })

  return NextResponse.json({ ok: true })
}
