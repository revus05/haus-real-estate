import type { Metadata } from "next";
import { ListingForm } from "@/components/listings/listing-form";

export const metadata: Metadata = { title: "Новое объявление" };

export default function NewListingPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Создать новое объявление</h1>
      <ListingForm mode="create" />
    </div>
  );
}
