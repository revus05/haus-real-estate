import Link from "next/link"
import Image from "next/image"
import { MapPin, BedDouble, Maximize2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: string | number
    currency: string
    city: string
    address: string
    dealType: string
    propertyType: string
    rooms: number | null
    area: string | number | null
    images: { url: string; altText: string | null }[]
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

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.images[0]

  return (
    <Link href={`/property/${property.id}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg py-0">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.altText ?? property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              Нет фотографии
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant={property.dealType === "RENT" ? "secondary" : "default"}>
              {property.dealType === "RENT" ? "Аренда" : "Продажа"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          <p className="text-xl font-semibold">
            {formatPrice(property.price, property.currency)}
            {property.dealType === "RENT" && (
              <span className="text-sm font-normal text-muted-foreground">/мес.</span>
            )}
          </p>
          <h3 className="font-medium text-sm line-clamp-2 leading-snug">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {property.city}, {property.address}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            {property.rooms != null && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3 w-3" />
                {property.rooms} {property.rooms === 1 ? "комната" : "комнат"}
              </span>
            )}
            {property.area != null && (
              <span className="flex items-center gap-1">
                <Maximize2 className="h-3 w-3" />
                {property.area} м²
              </span>
            )}
            <Badge variant="outline" className="ml-auto text-xs">
              {property.propertyType.charAt(0) +
                property.propertyType.slice(1).toLowerCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
