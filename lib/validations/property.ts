import { z } from "zod"

export const propertySchema = z.object({
  title: z.string().min(5, "Название должно быть минимум 5 символов"),
  description: z.string().min(20, "Описание должно быть минимум 20 символов"),
  dealType: z.enum(["SALE", "RENT"]),
  propertyType: z.enum([
    "APARTMENT",
    "HOUSE",
    "STUDIO",
    "COMMERCIAL",
    "LAND",
    "TOWNHOUSE",
  ]),
  price: z.coerce.number().positive("Цена должна быть положительной"),
  currency: z.string().default("BYN"),
  rooms: z.coerce.number().int().positive().optional().nullable(),
  area: z.coerce.number().positive().optional().nullable(),
  floor: z.coerce.number().int().optional().nullable(),
  totalFloors: z.coerce.number().int().positive().optional().nullable(),
  address: z.string().min(3, "Адрес обязателен"),
  city: z.string().min(2, "Город обязателен"),
  district: z.string().optional().nullable(),
})

export type PropertyInput = z.infer<typeof propertySchema>
