import type { Metadata } from "next"
import { Building2 } from "lucide-react"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Создать аккаунт" }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Создайте свой аккаунт</h1>
          <p className="text-sm text-muted-foreground">
            Начните покупать, арендовать или размещать объекты недвижимости
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
