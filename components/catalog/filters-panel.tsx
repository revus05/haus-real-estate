"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useFilters } from "@/hooks/use-filters";

const DEAL_TYPES = [
  { value: "ALL", label: "Все" },
  { value: "SALE", label: "Продажа" },
  { value: "RENT", label: "Аренда" },
];

const PROPERTY_TYPES = [
  { value: "ALL", label: "Все типы" },
  { value: "APARTMENT", label: "Квартира" },
  { value: "HOUSE", label: "Дом" },
  { value: "STUDIO", label: "Студия" },
  { value: "COMMERCIAL", label: "Коммерческое" },
  { value: "LAND", label: "Земля" },
  { value: "TOWNHOUSE", label: "Таунхаус" },
];

const ROOMS = [
  { value: "ANY", label: "Любое количество" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4+" },
];

export function FiltersPanel() {
  const { filters, setFilter, resetFilters } = useFilters();

  return (
    <aside className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Фильтры</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-xs h-7"
        >
          Сбросить все
        </Button>
      </div>

      <Separator />

      {/* Deal type */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Тип сделки
        </Label>
        <div className="flex flex-col gap-1.5">
          {DEAL_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilter("dealType", t.value === "ALL" ? "" : t.value)}
              className={`text-left text-sm px-2 py-1 rounded-md transition-colors ${
                (t.value === "ALL" && !filters.dealType) || filters.dealType === t.value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Property type */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Тип недвижимости
        </Label>
        <Select
          value={filters.propertyType || "ALL"}
          onValueChange={(v) => setFilter("propertyType", v === "ALL" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Все типы" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price range */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Диапазон цены
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Мин"
            value={filters.minPrice}
            onChange={(e) => setFilter("minPrice", e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Макс"
            value={filters.maxPrice}
            onChange={(e) => setFilter("maxPrice", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Rooms */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Комнаты
        </Label>
        <div className="flex gap-1 flex-wrap">
          {ROOMS.map((r) => (
            <button
              key={r.value}
              onClick={() => setFilter("rooms", r.value)}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                filters.rooms === r.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* City */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Город
        </Label>
        <Input
          placeholder="Например: Минск"
          value={filters.city}
          onChange={(e) => setFilter("city", e.target.value)}
          className="text-sm"
        />
      </div>

      <Separator />

      {/* Area */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">
          Площадь (м²)
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Мин"
            value={filters.minArea}
            onChange={(e) => setFilter("minArea", e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Макс"
            value={filters.maxArea}
            onChange={(e) => setFilter("maxArea", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>
    </aside>
  );
}
