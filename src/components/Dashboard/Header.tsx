"use client";

import { Menu, X, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { NAV_ITEMS } from "@/lib/admin-config";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({
  onToggleSidebar,
  isSidebarOpen,
}: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentPage = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`),
  );

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        borderBottom: "1px solid var(--z-border)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--z-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--z-bg-elevated)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div>
          <h1
            className="text-base font-semibold leading-none"
            style={{ color: "var(--z-text-primary)" }}
          >
            {currentPage?.label ?? "Dashboard"}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: "var(--z-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--z-bg-elevated)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--z-gold)" }}
          />
        </button>

        <div
          className="w-px h-5 mx-1"
          style={{ backgroundColor: "var(--z-border)" }}
        />

        {/* User chip */}
        <div className="flex items-center gap-2.5 cursor-default">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{
              backgroundColor: "var(--z-gold-muted)",
              color: "var(--z-gold)",
              border: "1px solid var(--z-border-gold)",
            }}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <p
              className="text-sm font-medium leading-none"
              style={{ color: "var(--z-text-primary)" }}
            >
              {user?.name}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
