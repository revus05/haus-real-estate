import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
