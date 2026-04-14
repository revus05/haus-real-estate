import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BedDouble, Maximize2, Building2, MapPin, Eye, Calendar } from "lucide-react"

interface PropertyInfoProps {
  property: {
    title: string
    description: string
    price: string | number
    currency: string
    dealType: string
    propertyType: string
    rooms: number | null
    area: string | number | null
    floor: number | null
    totalFloors: number | null
    address: string
    city: string
    district: string | null
    viewCount: number
    createdAt: string | Date
  }
}

function formatPrice(price: string | number, currency: string) {
  const num = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num)
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  const specs = [
    property.rooms != null && { label: "Комнаты", value: property.rooms, icon: BedDouble },
    property.area != null && { label: "Площадь", value: `${property.area} м²`, icon: Maximize2 },
    property.floor != null && {
      label: "Этаж",
      value: property.totalFloors
        ? `${property.floor} из ${property.totalFloors}`
        : String(property.floor),
      icon: Building2,
    },
  ].filter(Boolean) as { label: string; value: string | number; icon: React.ElementType }[]

  return (
    <div className="space-y-6">
      {/* Price + badges */}
      <div className="flex flex-wrap items-start gap-3">
        <h1 className="text-3xl font-bold">
          {formatPrice(property.price, property.currency)}
          {property.dealType === "RENT" && (
            <span className="text-lg font-normal text-muted-foreground">/мес.</span>
          )}
        </h1>
        <div className="flex gap-2 flex-wrap pt-1">
          <Badge variant={property.dealType === "RENT" ? "secondary" : "default"}>
            {property.dealType === "RENT" ? "В аренду" : "На продажу"}
          </Badge>
          <Badge variant="outline">
            {property.propertyType.charAt(0) +
              property.propertyType.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>

      <h2 className="text-xl font-semibold">{property.title}</h2>

      {/* Location */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4 shrink-0" />
        <span>
          {property.city}
          {property.district && `, ${property.district}`} — {property.address}
        </span>
      </div>

      {/* Specs grid */}
      {specs.length > 0 && (
        <>
          <Separator />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {specs.map((spec) => (
              <div key={spec.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <spec.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{spec.label}</p>
                  <p className="text-sm font-medium">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Separator />

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-semibold">Описание</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {property.description}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {property.viewCount} просмотров
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          Размещено{" "}
          {new Date(property.createdAt).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  )
}
