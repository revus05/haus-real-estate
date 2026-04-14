import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-secret-please-set-env",
);

const PROTECTED_PATHS = ["/dashboard", "/listings", "/leads"];
const ADMIN_PATHS = ["/admin"];
const AUTH_ONLY_PATHS = ["/login", "/register"];

interface JWTPayload {
  id: string;
  email: string;
  role: string;
  name: string;
}

async function decodeToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const user = token ? await decodeToken(token) : null;

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect non-admins away from admin routes
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  if (isAdmin && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect already-authenticated users away from login/register
  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p));
  if (isAuthOnly && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Inject decoded user info into request headers for API routes
  const requestHeaders = new Headers(req.headers);
  if (user) {
    requestHeaders.set("x-user-id", user.id);
    requestHeaders.set("x-user-role", user.role);
    requestHeaders.set("x-user-email", user.email);

    const encodedName = encodeURIComponent(user.name);
    requestHeaders.set("x-user-name", encodedName);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons).*)"],
};
