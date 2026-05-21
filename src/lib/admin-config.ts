import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, BookOpen, MessageSquare, User } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  separator?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "library",
    label: "Library",
    href: "/dashboard/library",
    icon: BookOpen,
    separator: true,
  },
  {
    id: "conversations",
    label: "Conversations",
    href: "/dashboard/conversations",
    icon: MessageSquare,
  },
  {
    id: "profile",
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
    separator: true,
  },
];
