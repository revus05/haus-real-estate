import { Badge } from "@/components/ui/badge"
import { LeadStatusSelect } from "./lead-status-select"
import Link from "next/link"

interface Lead {
  id: string
  name: string
  contact: string
  message: string | null
  status: string
  createdAt: string | Date
  property: { id: string; title: string }
}

interface LeadsTableProps {
  leads: Lead[]
}

const STATUS_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  NEW: "default",
  IN_PROGRESS: "secondary",
  DONE: "outline",
}

export function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Заявок нет. Они появятся когда пользователи свяжутся с вами по объектам.
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium text-muted-foreground">Контакт</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Объект</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Сообщение</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Дата</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-3">
                <p className="font-medium">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.contact}</p>
              </td>
              <td className="p-3">
                <Link
                  href={`/property/${lead.property.id}`}
                  className="text-primary hover:underline line-clamp-2 text-xs"
                >
                  {lead.property.title}
                </Link>
              </td>
              <td className="p-3 hidden md:table-cell">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {lead.message ?? "—"}
                </p>
              </td>
              <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
