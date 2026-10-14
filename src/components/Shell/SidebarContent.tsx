"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, X } from "lucide-react";
import { Avatar, Badge, SidebarNav } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useLimits } from "@/contexts/LimitsContext";
import { cn } from "@/lib/cn";
import { HOME_HREF, NAV, type ShellArea } from "./navigation";

// ---------------------------------------------------------------------------
// Free Pass usage card (reader only; hidden for admins, who are exempt)
// ---------------------------------------------------------------------------

function UsageMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
  const full = used >= limit;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="text-text-secondary tabular-nums">
          {Math.min(used, limit)} of {limit}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(used, limit)}
        className="h-1 rounded-full bg-bg-elevated"
      >
        <div
          className={cn("h-1 rounded-full", full ? "bg-gold" : "bg-text-secondary")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function UsageCard() {
  const { limits } = useLimits();
  if (!limits || limits.unlimited) return null;
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-bg-base p-4">
      <span className="text-xs font-medium tracking-[0.1em] text-text-secondary uppercase">
        Free Pass
      </span>
      <UsageMeter label="Books" used={limits.books.used} limit={limits.books.limit} />
      <UsageMeter
        label="Messages today"
        used={limits.messages.used}
        limit={limits.messages.limit}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar content — shared by the desktop sidebar and the mobile drawer
// ---------------------------------------------------------------------------

export function SidebarContent({
  area,
  onNavigate,
  onClose,
}: {
  area: ShellArea;
  /** Called when a link is followed (closes the drawer) */
  onNavigate?: () => void;
  /** Renders a close button (drawer only) */
  onClose?: () => void;
}) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <div className="flex items-center gap-2.5 px-2 py-1">
        <Link
          href={HOME_HREF[area]}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-sm text-text-primary"
        >
          <Image src="/logo.png" alt="" width={32} height={32} className="rounded-sm" />
          <span className="text-[17px] font-semibold">Zaydoun</span>
        </Link>
        {area === "admin" && (
          <Badge tone="gold" className="ml-auto h-[22px] px-[7px] text-[11px]">
            ADMIN
          </Badge>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className={cn(
              "flex size-11 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary",
              area === "admin" ? "-mr-2" : "-mr-2 ml-auto",
            )}
          >
            <X size={20} aria-hidden />
          </button>
        )}
      </div>

      <SidebarNav
        links={NAV[area]}
        ariaLabel={area === "admin" ? "Admin" : "App"}
        onNavigate={onNavigate}
      />

      <div className="mt-auto flex flex-col gap-4">
        {area === "reader" && <UsageCard />}

        <div className="flex items-center gap-2.5 border-t border-border px-1 pt-3">
          <Avatar name={user?.name} email={user?.email} highlight />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">
              {user?.name || user?.email}
            </span>
            <span className="truncate text-xs text-text-secondary">{user?.email}</span>
          </span>
          <button
            type="button"
            onClick={() => logout()}
            aria-label="Log out"
            title="Log out"
            className="flex size-10 shrink-0 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
          >
            <LogOut size={18} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rail content — 72px icon-only sidebar for the chat screen
// ---------------------------------------------------------------------------

export function RailContent({ area }: { area: ShellArea }) {
  const { user } = useAuth();
  return (
    <div className="flex h-full flex-col items-center gap-5 px-3 py-4">
      <Link href={HOME_HREF[area]} aria-label="Zaydoun home" className="rounded-sm">
        <Image src="/logo.png" alt="" width={36} height={36} className="rounded-[9px]" />
      </Link>
      <SidebarNav links={NAV[area]} ariaLabel="App" collapsed />
      <Link
        href={area === "admin" ? "/dashboard/profile" : "/app/profile"}
        aria-label="Profile"
        className="mt-auto rounded-full"
      >
        <Avatar name={user?.name} email={user?.email} highlight />
      </Link>
    </div>
  );
}
