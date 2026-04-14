import { z } from "zod"

// Belarusian phone validation: +375 XX XXX-XX-XX or (0)XX XXX-XX-XX
const belarusianPhoneRegex = /^(\+375\s?|0)?([0-9]{2})\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})$/

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно быть минимум 2 символа"),
  email: z.string().email("Неверный адрес электронной почты"),
  password: z.string().min(8, "Пароль должен быть минимум 8 символов"),
  phone: z
    .string()
    .regex(belarusianPhoneRegex, "Неверный формат номера телефона")
    .optional()
    .or(z.literal("")),
})

export const loginSchema = z.object({
  email: z.string().email("Неверный адрес электронной почты"),
  password: z.string().min(1, "Пароль обязателен"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
