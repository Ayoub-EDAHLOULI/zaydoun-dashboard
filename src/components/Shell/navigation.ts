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

export const NAV: Record<ShellArea, NavEntry[]> = {
  reader: [
    { href: "/app", label: "Home", icon: Home, exact: true },
    { href: "/app/library", label: "Library", icon: BookOpen },
    { href: "/app/conversations", label: "Conversations", icon: MessageSquare },
    { href: "/app/profile", label: "Profile", icon: User },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/library", label: "Library", icon: BookOpen },
    { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquare },
    { section: "Manage" },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ],
};

export const HOME_HREF: Record<ShellArea, string> = {
  reader: "/app",
  admin: "/dashboard",
};

// Title shown in the mobile top bar for each route
const TITLES: Array<[RegExp, string]> = [
  [/^\/app$/, "Home"],
  [/^\/app\/library$/, "Library"],
  [/^\/app\/conversations$/, "Conversations"],
  [/^\/app\/conversations\/[^/]+$/, "Conversation"],
  [/^\/app\/profile$/, "Profile"],
  [/^\/dashboard$/, "Overview"],
  [/^\/dashboard\/library$/, "Library"],
  [/^\/dashboard\/conversations$/, "Conversations"],
  [/^\/dashboard\/users$/, "Users"],
  [/^\/dashboard\/profile$/, "Profile"],
];

export function pageTitle(pathname: string): string {
  return TITLES.find(([re]) => re.test(pathname))?.[1] ?? "Zaydoun";
}

// The chat screen collapses the sidebar to a 72px icon rail
export function usesRail(pathname: string): boolean {
  return /^\/app\/conversations\/[^/]+$/.test(pathname);
}
