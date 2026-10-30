// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Route access matrix
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/dashboard": ["CUSTOMER", "AGENT", "ADMIN"],
  "/chat": ["CUSTOMER", "AGENT", "ADMIN"],
  "/conversations": ["CUSTOMER", "AGENT", "ADMIN"],
  "/tickets": ["CUSTOMER", "AGENT", "ADMIN"],
  "/agent": ["AGENT", "ADMIN"],
  "/admin": ["ADMIN"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({
    req,
    secret:
      process.env.AUTH_SECRET ||
      process.env.NEXTAUTH_SECRET ||
      "supportai-secret-default-key-32charslong-production-grade",
  });

  // Redirect authenticated users away from auth pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Check protected routes
  for (const [route, roles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      const userRole = (token.role as string) || "CUSTOMER";
      if (!roles.includes(userRole)) {
        if (userRole === "CUSTOMER") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/register).*)",
  ],
};
