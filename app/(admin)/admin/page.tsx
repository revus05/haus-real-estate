import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { StatsCards } from "@/components/admin/stats-cards"
import { Button } from "@/components/ui/button"
import { Users, LayoutList } from "lucide-react"

export const metadata: Metadata = { title: "Администрирование — Панель управления" }

export default async function AdminPage() {
  const [totalUsers, totalProperties, pendingProperties, totalLeads] =
    await Promise.all([
      prisma.user.count(),
      prisma.property.count({ where: { moderationStatus: "PUBLISHED" } }),
      prisma.property.count({ where: { moderationStatus: "PENDING" } }),
      prisma.lead.count(),
    ])

  return (
    <div className="max-w-5xl space-y-8">
      <h1 className="text-2xl font-bold">Панель управления</h1>

      <StatsCards
        stats={{ totalUsers, totalProperties, pendingProperties, totalLeads }}
      />

      <div className="flex gap-3">
        <Button asChild>
          <Link href="/admin/users">
            <Users className="h-4 w-4 mr-2" />
            Управление пользователями
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/moderation">
            <LayoutList className="h-4 w-4 mr-2" />
            Очередь модерации
          </Link>
        </Button>
      </div>
    </div>
  )
}
