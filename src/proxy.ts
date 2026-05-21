import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "@/lib/routes";

const COOKIE_NAME = "refreshToken";
const ROOT = "/";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow root — it renders a spinner then redirects client-side
  if (pathname === ROOT) return NextResponse.next();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const hasSession = request.cookies.has(COOKIE_NAME);

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
