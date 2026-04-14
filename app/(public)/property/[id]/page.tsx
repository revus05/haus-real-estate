import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ImageGallery } from "@/components/property/image-gallery"
import { PropertyInfo } from "@/components/property/property-info"
import { RealtorCard } from "@/components/property/realtor-card"
import { LeadForm } from "@/components/property/lead-form"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params
  const property = await prisma.property.findUnique({
    where: { id },
    select: { title: true, description: true },
  })
  if (!property) return { title: "Не найдено" }
  return {
    title: property.title,
    description: property.description.slice(0, 160),
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { order: "asc" } },
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
        },
      },
    },
  })

  if (!property) notFound()

  // Increment view count (fire-and-forget)
  prisma.property.update({ where: { id }, data: { viewCount: { increment: 1 } } })

  const serialized = {
    ...property,
    price: property.price.toString(),
    area: property.area?.toString() ?? null,
    latitude: property.latitude?.toString() ?? null,
    longitude: property.longitude?.toString() ?? null,
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
    images: property.images.map((img) => ({
      url: img.url,
      altText: img.altText,
    })),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: gallery + info */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={serialized.images} title={serialized.title} />
            <PropertyInfo property={serialized} />
          </div>

          {/* Right: realtor + CTA */}
          <aside className="space-y-4">
            <LeadForm propertyId={id} propertyTitle={property.title} />
            <RealtorCard owner={property.owner} />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
