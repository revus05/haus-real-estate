import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, ClipboardList, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalUsers: number
    totalProperties: number
    pendingProperties: number
    totalLeads: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Всего пользователей",
      value: stats.totalUsers,
      icon: Users,
      description: "Зарегистрированные аккаунты",
    },
    {
      title: "Опубликованные объявления",
      value: stats.totalProperties,
      icon: Building2,
      description: "Активные объекты",
    },
    {
      title: "На проверке",
      value: stats.pendingProperties,
      icon: TrendingUp,
      description: "Ожидают модерации",
    },
    {
      title: "Всего заявок",
      value: stats.totalLeads,
      icon: ClipboardList,
      description: "Запросы контактов",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
