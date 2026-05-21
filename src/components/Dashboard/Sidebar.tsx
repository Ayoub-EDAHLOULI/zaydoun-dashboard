"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/lib/admin-config";
import { useAuth } from "@/contexts/AuthContext";

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}
      style={{
        backgroundColor: "var(--z-bg-surface)",
        borderRight: "1px solid var(--z-border)",
        width: "256px",
      }}
    >
      {/* Logo */}
      <div
        className="h-16 flex items-center gap-3 px-5 shrink-0"
        style={{ borderBottom: "1px solid var(--z-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--z-gold-muted)",
            border: "1px solid var(--z-border-gold)",
          }}
        >
          <BookOpen className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
        </div>
        <span
          className="text-base font-bold tracking-wide"
          style={{ color: "var(--z-text-primary)" }}
        >
          Zaydoun
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);

            return (
              <React.Fragment key={item.id}>
                {item.separator && (
                  <li>
                    <div
                      className="my-3 mx-1"
                      style={{
                        height: "1px",
                        backgroundColor: "var(--z-border)",
                      }}
                    />
                  </li>
                )}
                <li>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{
                      backgroundColor: isActive
                        ? "var(--z-gold-muted)"
                        : "transparent",
                      color: isActive ? "var(--z-gold)" : "var(--z-text-muted)",
                      border: isActive
                        ? "1px solid var(--z-border-gold)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor =
                          "var(--z-bg-elevated)";
                        e.currentTarget.style.color = "var(--z-text-secondary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "var(--z-text-muted)";
                      }
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              </React.Fragment>
            );
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div
        className="p-4 shrink-0"
        style={{ borderTop: "1px solid var(--z-border)" }}
      >
        <div className="flex items-center gap-3">
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
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "var(--z-text-primary)" }}
            >
              {user?.name}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--z-text-muted)" }}
            >
              {user?.email}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="shrink-0 transition-colors p-1.5 rounded-lg"
            style={{ color: "var(--z-text-muted)" }}
            title="Sign out"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--z-error)";
              e.currentTarget.style.backgroundColor = "rgba(224,92,92,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--z-text-muted)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
