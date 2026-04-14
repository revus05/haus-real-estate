"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFilters } from "@/hooks/use-filters"

export function SearchBar() {
  const { filters, setFilter } = useFilters()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9 pr-9"
        placeholder="Поиск по названию, адресу или городу…"
        value={filters.q}
        onChange={(e) => setFilter("q", e.target.value)}
      />
      {filters.q && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setFilter("q", "")}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
