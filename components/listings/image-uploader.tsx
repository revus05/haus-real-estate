"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface UploadedImage {
  id: string
  url: string
  order: number
}

interface ImageUploaderProps {
  propertyId: string
  initialImages?: UploadedImage[]
  onChange?: (images: UploadedImage[]) => void
}

export function ImageUploader({
  propertyId,
  initialImages = [],
  onChange,
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(`/api/properties/${propertyId}/images`, {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const err = await res.json()
          toast.error(err.error ?? "Загрузка не удалась")
          continue
        }

        const { image } = await res.json()
        setImages((prev) => {
          const next = [...prev, image]
          onChange?.(next)
          return next
        })
      }
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function handleDelete(imageId: string) {
    const res = await fetch(`/api/properties/${propertyId}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    })

    if (!res.ok) {
      toast.error("Не удалось удалить изображение")
      return
    }

    setImages((prev) => {
      const next = prev.filter((img) => img.id !== imageId)
      onChange?.(next)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {/* Upload zone */}
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Загрузка…</span>
          </div>
        ) : (
          <div className="space-y-1">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Нажмите для загрузки или перетащите</p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP — максимум 5 МБ каждый</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
              <Image src={img.url} alt="Property photo" fill className="object-cover" sizes="120px" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(img.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
