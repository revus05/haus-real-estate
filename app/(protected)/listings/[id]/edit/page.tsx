import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ListingForm } from "@/components/listings/listing-form";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Редактировать объявление" };

export default async function EditListingPage({
  params,
}: EditListingPageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) notFound();
  if (property.ownerId !== session.id && session.role !== "ADMIN") {
    redirect("/listings");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Редактировать объявление</h1>
      <ListingForm
        mode="edit"
        propertyId={id}
        defaultValues={{
          title: property.title,
          description: property.description,
          dealType: property.dealType,
          propertyType: property.propertyType,
          price: parseFloat(property.price.toString()),
          currency: property.currency,
          rooms: property.rooms,
          area: property.area ? parseFloat(property.area.toString()) : null,
          floor: property.floor,
          totalFloors: property.totalFloors,
          address: property.address,
          city: property.city,
          district: property.district,
        }}
      />
    </div>
  );
}
