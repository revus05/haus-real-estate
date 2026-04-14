"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type PropertyInput, propertySchema } from "@/lib/validations/property";
import { ImageUploader } from "./image-uploader";

interface ListingFormProps {
  mode: "create" | "edit";
  propertyId?: string;
  defaultValues?: Partial<PropertyInput>;
}

export function ListingForm({
  mode,
  propertyId,
  defaultValues,
}: ListingFormProps) {
  const router = useRouter();

  const form = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema) as Resolver<PropertyInput>,
    defaultValues: {
      title: "",
      description: "",
      dealType: "SALE",
      propertyType: "APARTMENT",
      price: 0,
      currency: "BYN",
      address: "",
      city: "",
      ...defaultValues,
    },
  });

  async function onSubmit(values: PropertyInput) {
    if (mode === "create") {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Не удалось создать объявление");
        return;
      }
      toast.success("Объявление создано! Загрузите фотографии ниже.");
      router.push(`/listings/${data.property.id}/edit`);
    } else if (mode === "edit" && propertyId) {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        toast.error("Не удалось обновить объявление");
        return;
      }
      toast.success("Объявление обновлено!");
      router.push("/listings");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input
                  placeholder="Просторная 2-комнатная квартира в центре города"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deal type + Property type */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dealType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип сделки</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SALE">Продажа</SelectItem>
                    <SelectItem value="RENT">Аренда</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип недвижимости</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      { value: "APARTMENT", label: "Квартира" },
                      { value: "HOUSE", label: "Дом" },
                      { value: "STUDIO", label: "Студия" },
                      { value: "COMMERCIAL", label: "Коммерческое" },
                      { value: "LAND", label: "Земля" },
                      { value: "TOWNHOUSE", label: "Таунхаус" },
                    ].map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price + currency */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="250000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Валюта</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? "BYN"}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["BYN", "USD", "EUR"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Rooms + Area + Floor */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="rooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Комнаты</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="2"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Площадь (м²)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="60"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Этаж</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="3"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Город</FormLabel>
                <FormControl>
                  <Input placeholder="Минск" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Район (опционально)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Октябрьский"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес</FormLabel>
              <FormControl>
                <Input placeholder="ул. Ленина, дом 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Описание недвижимости подробно…"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photos — only shown in edit mode after property is created */}
        {mode === "edit" && propertyId && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Фотографии</p>
            <ImageUploader propertyId={propertyId} />
          </div>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {mode === "create" ? "Создать объявление" : "Сохранить изменения"}
        </Button>
      </form>
    </Form>
  );
}
