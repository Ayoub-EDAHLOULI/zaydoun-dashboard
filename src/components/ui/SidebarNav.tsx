"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Only active on an exact match (e.g. "/app" must not light up on "/app/library") */
  exact?: boolean;
}

export function isNavActive(pathname: string, link: NavLink): boolean {
  if (pathname === link.href) return true;
  return !link.exact && pathname.startsWith(`${link.href}/`);
}

// ---------------------------------------------------------------------------
// NavItem — default / hover / active (gold-muted fill + 3px gold bar)
// ---------------------------------------------------------------------------

export function NavItem({
  link,
  active,
  collapsed = false,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  /** Icon-only, for the 72px rail on the chat screen */
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? link.label : undefined}
      title={collapsed ? link.label : undefined}
      className={cn(
        "relative flex h-11 items-center gap-3 rounded-sm text-[15px] transition-colors",
        collapsed ? "w-11 justify-center" : "px-3",
        active
          ? "bg-gold-muted font-medium text-gold-light"
          : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
      )}
    >
      {active && (
        <span
          aria-hidden
          className={cn(
            "absolute top-3 h-5 w-[3px] rounded-r-[3px] bg-gold",
            collapsed ? "-left-3.5" : "-left-4",
          )}
        />
      )}
      <Icon size={18} aria-hidden />
      {!collapsed && link.label}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// SidebarNav — a list of NavItems; the active one comes from the URL.
// Expects to sit inside a container with 16px side padding (12px collapsed).
// ---------------------------------------------------------------------------

export function SidebarNav({
  links,
  ariaLabel,
  collapsed = false,
  onNavigate,
}: {
  links: NavLink[];
  ariaLabel: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-0.5", collapsed && "items-center")}
    >
      {links.map((link) => (
        <NavItem
          key={link.href}
          link={link}
          active={isNavActive(pathname, link)}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
