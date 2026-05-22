// lib/routes.ts

export const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export function getDashboardPath(role?: "USER" | "ADMIN"): string {
  return role === "USER" ? "/app" : "/dashboard";
}
