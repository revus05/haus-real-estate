import { cookies } from "next/headers"
import { verifyToken } from "./jwt"
import type { SessionUser } from "./types"

export const TOKEN_COOKIE = "token"

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_COOKIE)?.value
  if (!token) return null
  return verifyToken(token)
}
