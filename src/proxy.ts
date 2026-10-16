import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const COOKIE_NAME = "refreshToken";
const PROTECTED_PREFIXES = ["/dashboard", "/app"];

const handleI18n = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // "/fr/app/library" → locale "fr", path "/app/library"
  const [, first, ...rest] = pathname.split("/");
  const prefixed = hasLocale(routing.locales, first);
  const path = prefixed ? `/${rest.join("/")}` : pathname;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`),
  );

  if (isProtected && !request.cookies.has(COOKIE_NAME)) {
    const prefix =
      prefixed && first !== routing.defaultLocale ? `/${first}` : "";
    return NextResponse.redirect(new URL(`${prefix}/login`, request.url));
  }

  // Locale prefix handling (adds/strips the prefix, remembers the choice)
  return handleI18n(request);
}

export const config = {
  // Everything except Next internals and files with an extension
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
