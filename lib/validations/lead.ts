import { z } from "zod"

export const leadSchema = z.object({
  name: z.string().min(2, "Имя обязательно"),
  contact: z.string().min(3, "Email или телефон обязателен"),
  message: z.string().optional(),
  propertyId: z.string().cuid("Некорректный объект"),
})

export type LeadInput = z.infer<typeof leadSchema>
