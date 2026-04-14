"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Property {
  id: string
  title: string
  city: string
  price: string | number
  currency: string
  moderationStatus: string
  createdAt: string | Date
  owner: { name: string; email: string }
  images: { url: string }[]
}

export function ModerationTable({ properties: initial }: { properties: Property[] }) {
  const [properties, setProperties] = useState(initial)
  const router = useRouter()

  async function handleModerate(id: string, moderationStatus: string) {
    const res = await fetch("/api/admin/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, moderationStatus }),
    })
    if (!res.ok) { toast.error("Не удалось обновить статус"); return }
    setProperties((prev) => prev.filter((p) => p.id !== id))
    toast.success(`Объект ${moderationStatus === "PUBLISHED" ? "одобрен" : "отклонен"}`)
    router.refresh()
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Нет объектов на проверке.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {properties.map((p) => (
        <div key={p.id} className="flex gap-4 p-4 border rounded-lg">
          <div className="relative h-20 w-28 shrink-0 rounded-md overflow-hidden bg-muted">
            {p.images[0] && (
              <Image src={p.images[0].url} alt={p.title} fill className="object-cover" sizes="112px" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link href={`/property/${p.id}`} className="font-medium hover:underline line-clamp-1">
              {p.title}
            </Link>
            <p className="text-xs text-muted-foreground">{p.city} · от {p.owner.name}</p>
            <Badge variant="secondary" className="mt-1 text-xs">
              {p.moderationStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
              onClick={() => handleModerate(p.id, "PUBLISHED")}
            >
              <Check className="h-4 w-4 mr-1" /> Одобрить
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => handleModerate(p.id, "REJECTED")}
            >
              <X className="h-4 w-4 mr-1" /> Отклонить
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
