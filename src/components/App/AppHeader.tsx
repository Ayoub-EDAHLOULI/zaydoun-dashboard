"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const PAGE_LABELS: Record<string, string> = {
  "/app": "Overview",
  "/app/library": "My Library",
  "/app/conversations": "Conversations",
  "/app/profile": "Profile",
};

interface AppHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function AppHeader({ onToggleSidebar, isSidebarOpen }: AppHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const label = PAGE_LABELS[pathname ?? ""] ?? "Zaydoun";

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--z-bg-elevated)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <h1 className="text-base font-semibold leading-none" style={{ color: "var(--z-text-primary)" }}>
          {label}
        </h1>
      </div>

      {/* Right — user chip */}
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
          <p className="text-sm font-medium leading-none" style={{ color: "var(--z-text-primary)" }}>
            {user?.name ?? user?.email}
          </p>
        </div>
      </div>
    </header>
  );
}
