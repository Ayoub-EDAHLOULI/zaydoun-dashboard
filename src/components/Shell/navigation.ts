import {
  BookOpen,
  Home,
  LayoutDashboard,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import type { NavEntry } from "@/components/ui";

export type ShellArea = "reader" | "admin";

// Labels / section names are keys in messages/<locale>/nav.json
export const NAV: Record<ShellArea, NavEntry[]> = {
  reader: [
    { href: "/app", label: "home", icon: Home, exact: true },
    { href: "/app/library", label: "library", icon: BookOpen },
    { href: "/app/conversations", label: "conversations", icon: MessageSquare },
    { href: "/app/profile", label: "profile", icon: User },
  ],
  admin: [
    { href: "/dashboard", label: "overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/library", label: "library", icon: BookOpen },
    { href: "/dashboard/conversations", label: "conversations", icon: MessageSquare },
    { section: "manage" },
    { href: "/dashboard/users", label: "users", icon: Users },
    { href: "/dashboard/profile", label: "profile", icon: User },
  ],
};

export const HOME_HREF: Record<ShellArea, string> = {
  reader: "/app",
  admin: "/dashboard",
};

export type NavKey =
  | "home"
  | "library"
  | "conversations"
  | "conversation"
  | "profile"
  | "overview"
  | "users";

// Title shown in the mobile top bar for each route (a nav.json key)
const TITLES: Array<[RegExp, NavKey]> = [
  [/^\/app$/, "home"],
  [/^\/app\/library$/, "library"],
  [/^\/app\/conversations$/, "conversations"],
  [/^\/app\/conversations\/[^/]+$/, "conversation"],
  [/^\/app\/profile$/, "profile"],
  [/^\/dashboard$/, "overview"],
  [/^\/dashboard\/library$/, "library"],
  [/^\/dashboard\/conversations$/, "conversations"],
  [/^\/dashboard\/users$/, "users"],
  [/^\/dashboard\/profile$/, "profile"],
];

export function pageTitleKey(pathname: string): NavKey | undefined {
  return TITLES.find(([re]) => re.test(pathname))?.[1];
}

// The chat screen collapses the sidebar to a 72px icon rail
export function usesRail(pathname: string): boolean {
  return /^\/app\/conversations\/[^/]+$/.test(pathname);
}
