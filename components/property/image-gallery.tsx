"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: { url: string; altText: string | null }[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
        No photos available
      </div>
    )
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setActiveIndex((i) => (i + 1) % images.length)

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted">
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].altText ?? title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 70vw"
        />
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-80 hover:opacity-100"
              onClick={prev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full opacity-80 hover:opacity-100"
              onClick={next}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative shrink-0 h-16 w-24 rounded-md overflow-hidden border-2 transition-colors",
                i === activeIndex ? "border-primary" : "border-transparent hover:border-muted-foreground"
              )}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `Photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
