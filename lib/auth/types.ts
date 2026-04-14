export type UserRole = "USER" | "REALTOR" | "ADMIN"

export interface JWTPayload {
  id: string
  email: string
  role: UserRole
  name: string
}

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  name: string
}
