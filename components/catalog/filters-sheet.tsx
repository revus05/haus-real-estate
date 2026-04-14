"use client"

import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FiltersPanel } from "./filters-panel"

export function FiltersSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          Фильтры
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <FiltersPanel />
        </div>
      </SheetContent>
    </Sheet>
  )
}
