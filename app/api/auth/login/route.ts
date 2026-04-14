import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/auth/password"
import { signToken } from "@/lib/auth/jwt"
import { loginSchema } from "@/lib/validations/auth"
import { TOKEN_COOKIE } from "@/lib/auth/session"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role }
    const response = NextResponse.json({ user: safeUser })
    response.cookies.set(TOKEN_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return response
  } catch (err) {
    console.error("[login]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
