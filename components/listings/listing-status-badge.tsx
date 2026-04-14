import { Badge } from "@/components/ui/badge"

type Status = "PENDING" | "PUBLISHED" | "REJECTED"

const STATUS_CONFIG: Record<Status, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "На проверке", variant: "secondary" },
  PUBLISHED: { label: "Опубликовано", variant: "default" },
  REJECTED: { label: "Отклонено", variant: "destructive" },
}

export function ListingStatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
