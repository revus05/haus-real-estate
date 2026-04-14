import { PropertyCard } from "./property-card"

interface Property {
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

interface PropertyGridProps {
  properties: Property[]
}

export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No properties found
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Try adjusting your filters or search query
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
