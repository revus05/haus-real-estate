import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  cloudinaryId: string
}

export async function uploadImage(
  file: File,
  folder = "haus/properties"
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise<UploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"))
        resolve({ url: result.secure_url, cloudinaryId: result.public_id })
      })
      .end(buffer)
  })
}

export async function deleteImage(cloudinaryId: string): Promise<void> {
  await cloudinary.uploader.destroy(cloudinaryId)
}
