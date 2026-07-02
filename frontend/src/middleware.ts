import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;

  // Redirect logged-out users away from protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect logged-in users away from auth routes
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password", "/reset-password"],
};