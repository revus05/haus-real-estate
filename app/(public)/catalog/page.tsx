import type { Metadata } from "next"
import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { PropertyGrid } from "@/components/catalog/property-grid"
import { FiltersPanel } from "@/components/catalog/filters-panel"
import { FiltersSheet } from "@/components/catalog/filters-sheet"
import { SearchBar } from "@/components/catalog/search-bar"
import { SortSelect } from "@/components/catalog/sort-select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Prisma } from "@/lib/generated/prisma/client"

export const metadata: Metadata = { title: "Каталог недвижимости" }

const PAGE_SIZE = 12

interface CatalogPageProps {
  searchParams: Promise<{
    dealType?: string
    propertyType?: string
    city?: string
    minPrice?: string
    maxPrice?: string
    rooms?: string
    minArea?: string
    maxArea?: string
    sort?: string
    q?: string
    page?: string
  }>
}

async function CatalogResults({ searchParams }: CatalogPageProps) {
  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? "1", 10))

  const where: Prisma.PropertyWhereInput = { moderationStatus: "PUBLISHED" }

  if (params.dealType === "SALE" || params.dealType === "RENT")
    where.dealType = params.dealType
  if (
    params.propertyType &&
    ["APARTMENT", "HOUSE", "STUDIO", "COMMERCIAL", "LAND", "TOWNHOUSE"].includes(
      params.propertyType
    )
  ) {
    where.propertyType = params.propertyType as Prisma.EnumPropertyTypeFilter["equals"]
  }
  if (params.city) where.city = { contains: params.city, mode: "insensitive" }
  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) where.price.gte = params.minPrice
    if (params.maxPrice) where.price.lte = params.maxPrice
  }
  if (params.rooms) where.rooms = parseInt(params.rooms, 10)
  if (params.minArea || params.maxArea) {
    where.area = {}
    if (params.minArea) where.area.gte = params.minArea
    if (params.maxArea) where.area.lte = params.maxArea
  }
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { address: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
    ]
  }

  const sort = params.sort ?? "date_desc"
  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
        ? { price: "desc" }
        : sort === "views_desc"
          ? { viewCount: "desc" }
          : { createdAt: "desc" }

  const [total, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Build base params string for pagination links
  const baseParams = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v && k !== "page") baseParams.set(k, v)
  }

  const serialized = properties.map((p) => ({
    ...p,
    price: p.price.toString(),
    area: p.area?.toString() ?? null,
    images: p.images.map((img) => ({
      url: img.url,
      altText: img.altText,
    })),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "объект" : "объектов"} найдено
        </p>
      </div>

      <PropertyGrid properties={serialized} />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={`/catalog?${baseParams.toString()}&page=${page - 1}`}
                />
              </PaginationItem>
            )}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={`/catalog?${baseParams.toString()}&page=${p}`}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            {page < totalPages && (
              <PaginationItem>
                <PaginationNext
                  href={`/catalog?${baseParams.toString()}&page=${page + 1}`}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export default function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Каталог недвижимости</h1>

        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
          <Suspense>
            <SortSelect />
          </Suspense>
          <Suspense>
            <FiltersSheet />
          </Suspense>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Suspense>
              <FiltersPanel />
            </Suspense>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<CatalogSkeleton />}>
              <CatalogResults searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
