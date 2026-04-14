"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"

export interface PropertyFilters {
  dealType: string
  propertyType: string
  city: string
  minPrice: string
  maxPrice: string
  rooms: string
  minArea: string
  maxArea: string
  sort: string
  q: string
  page: string
}

export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: PropertyFilters = {
    dealType: searchParams.get("dealType") ?? "",
    propertyType: searchParams.get("propertyType") ?? "",
    city: searchParams.get("city") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    rooms: searchParams.get("rooms") ?? "",
    minArea: searchParams.get("minArea") ?? "",
    maxArea: searchParams.get("maxArea") ?? "",
    sort: searchParams.get("sort") ?? "date_desc",
    q: searchParams.get("q") ?? "",
    page: searchParams.get("page") ?? "1",
  }

  const setFilter = useCallback(
    (key: keyof PropertyFilters, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 when filter changes (unless changing page itself)
      if (key !== "page") {
        params.delete("page")
      }
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const resetFilters = useCallback(() => {
    router.replace(pathname)
  }, [router, pathname])

  return { filters, setFilter, resetFilters }
}
