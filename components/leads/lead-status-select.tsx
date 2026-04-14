"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STATUS_LABELS: Record<string, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  DONE: "Завершена",
}

interface LeadStatusSelectProps {
  leadId: string
  currentStatus: string
}

export function LeadStatusSelect({ leadId, currentStatus }: LeadStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleChange(value: string) {
    setLoading(true)
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    })
    setLoading(false)

    if (!res.ok) {
      toast.error("Не удалось обновить статус")
      return
    }

    setStatus(value)
    toast.success("Статус обновлён")
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-[130px] h-7 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_LABELS).map(([val, label]) => (
          <SelectItem key={val} value={val} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
