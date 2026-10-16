import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-ins for next/link and next/navigation. Always import
// Link / useRouter / usePathname / redirect from here, never from Next:
// these keep the current language prefix (and usePathname returns the path
// without it, e.g. "/app/library").
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
