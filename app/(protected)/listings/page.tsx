import type { Metadata } from "next"
import Link from "next/link"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ListingStatusBadge } from "@/components/listings/listing-status-badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = { title: "Мои объявления" }

export default async function ListingsPage() {
  const session = await getSession()
  if (!session) return null

  const properties = await prisma.property.findMany({
    where: { ownerId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
  })

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои объявления</h1>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="h-4 w-4 mr-2" />
            Новое объявление
          </Link>
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-muted-foreground">
            Вы не разместили объявления.
          </p>
          <Button asChild>
            <Link href="/listings/new">Создайте своё первое объявление</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p) => (
            <div
              key={p.id}
              className="flex gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="relative h-20 w-28 shrink-0 rounded-md overflow-hidden bg-muted">
                {p.images[0] && (
                  <Image
                    src={p.images[0].url}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <Link
                  href={`/property/${p.id}`}
                  className="font-medium hover:underline line-clamp-1"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {p.city} · {p.dealType === "RENT" ? "Аренда" : "Продажа"}
                </p>
                <ListingStatusBadge
                  status={p.moderationStatus as "PENDING" | "PUBLISHED" | "REJECTED"}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/listings/${p.id}/edit`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <DeleteButton propertyId={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DeleteButton({ propertyId }: { propertyId: string }) {
  // Client component needed — using a server action approach via a form
  return (
    <form
      action={async () => {
        "use server"
        const { prisma: db } = await import("@/lib/prisma")
        await db.property.delete({ where: { id: propertyId } })
        const { revalidatePath } = await import("next/cache")
        revalidatePath("/listings")
      }}
    >
      <Button
        type="submit"
        size="sm"
        variant="outline"
        className="text-destructive hover:text-destructive border-destructive/30"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </form>
  )
}
