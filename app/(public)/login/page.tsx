import type { Metadata } from "next"
import { Building2 } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Вход" }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Добро пожаловать!</h1>
          <p className="text-sm text-muted-foreground">
            Войдите в свой аккаунт Haus
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
