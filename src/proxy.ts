import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "@/lib/routes";

const COOKIE_NAME = "refreshToken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérification simple puisque tout est à la racine (/login, /reset-password, etc.)
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const hasSession = request.cookies.has(COOKIE_NAME);

  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
