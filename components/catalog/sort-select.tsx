"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFilters } from "@/hooks/use-filters"

const SORT_OPTIONS = [
  { value: "date_desc", label: "Новые первыми" },
  { value: "price_asc", label: "Цена: от меньшего к большему" },
  { value: "price_desc", label: "Цена: от большего к меньшему" },
  { value: "views_desc", label: "Самые просматриваемые" },
]

export function SortSelect() {
  const { filters, setFilter } = useFilters()

  return (
    <Select
      value={filters.sort || "date_desc"}
      onValueChange={(v) => setFilter("sort", v)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
