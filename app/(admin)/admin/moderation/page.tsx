import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ModerationTable } from "@/components/admin/moderation-table"

export const metadata: Metadata = { title: "Администрирование — Очередь модерации" }

export default async function AdminModerationPage() {
  const properties = await prisma.property.findMany({
    where: { moderationStatus: "PENDING" },
    include: {
      owner: { select: { name: true, email: true } },
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "asc" },
  })

  const serialized = properties.map((p) => ({
    ...p,
    price: p.price.toString(),
    area: p.area?.toString() ?? null,
    latitude: p.latitude?.toString() ?? null,
    longitude: p.longitude?.toString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Очередь модерации</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {properties.length} {properties.length === 1 ? "объект" : "объектов"} ожидают проверки
        </p>
      </div>
      <ModerationTable properties={serialized} />
    </div>
  )
}
