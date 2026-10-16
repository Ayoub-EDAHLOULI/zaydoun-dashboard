"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ArrowLeftRight,
  Globe,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Avatar,
  Badge,
  LocaleSwitcher,
  SidebarNav,
  type NavEntry,
} from "@/components/ui";
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
  const t = useTranslations("nav.usage");
  const pct = Math.min(100, Math.round((used / Math.max(limit, 1)) * 100));
  const full = used >= limit;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-13">
        <span>{label}</span>
        <span className="text-text-secondary tabular-nums">
          {t("of", { used: Math.min(used, limit), limit })}
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
          className={cn(
            "h-1 rounded-full",
            full ? "bg-gold" : "bg-text-secondary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function UsageCard() {
  const t = useTranslations("nav.usage");
  const { limits } = useLimits();
  if (!limits || limits.unlimited) return null;
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-bg-base p-4">
      <span className="text-xs font-medium tracking-[0.1em] text-text-secondary uppercase">
        {t("freePass")}
      </span>
      <UsageMeter
        label={t("books")}
        used={limits.books.used}
        limit={limits.books.limit}
      />
      <UsageMeter
        label={t("messagesToday")}
        used={limits.messages.used}
        limit={limits.messages.limit}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Switch between the reader app and the admin area (admins only).
// Admins chat in the reader app, so they need a way back to /dashboard.
// ---------------------------------------------------------------------------

const SWITCH = {
  reader: { href: "/dashboard", label: "adminDashboard" },
  admin: { href: "/app", label: "readerApp" },
} as const;

// Nav entries with their labels translated
function useNavEntries(area: ShellArea): NavEntry[] {
  const t = useTranslations("nav");
  return NAV[area].map((e) =>
    "section" in e
      ? { section: t(e.section as "manage") }
      : { ...e, label: t(e.label as "home") },
  );
}

// Outlined link at the bottom of the sidebar (icon-only in the rail)
function ShellLinkButton({
  href,
  label,
  icon: Icon,
  collapsed = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      className={cn(
        "flex h-11 items-center gap-3 rounded-sm border border-border text-sm text-text-secondary transition-colors hover:border-border-strong hover:bg-bg-elevated hover:text-text-primary",
        collapsed ? "w-11 justify-center" : "px-3",
      )}
    >
      <Icon size={18} aria-hidden />
      {!collapsed && label}
    </Link>
  );
}

function AreaSwitch(props: {
  area: ShellArea;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  const target = SWITCH[props.area];
  return (
    <ShellLinkButton
      {...props}
      href={target.href}
      label={t(target.label)}
      icon={ArrowLeftRight}
    />
  );
}

// Back to the marketing site (zaydoun.ai home page)
function BackToSite(props: { collapsed?: boolean; onNavigate?: () => void }) {
  const t = useTranslations("nav");
  return (
    <ShellLinkButton {...props} href="/" label={t("backToSite")} icon={Globe} />
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
  const t = useTranslations("nav");
  const { user, logout } = useAuth();
  const links = useNavEntries(area);

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <div className="flex items-center gap-2.5 px-2 py-1">
        <Link
          href={HOME_HREF[area]}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-sm text-text-primary"
        >
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="text-17 font-semibold">Zaydoun</span>
        </Link>
        {area === "admin" && (
          <Badge tone="gold" className="ms-auto h-[22px] px-[7px] text-11">
            {t("adminBadge")}
          </Badge>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeNavigation")}
            className={cn(
              "flex size-11 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary",
              area === "admin" ? "-me-2" : "-me-2 ms-auto",
            )}
          >
            <X size={20} aria-hidden />
          </button>
        )}
      </div>

      <SidebarNav
        links={links}
        ariaLabel={area === "admin" ? t("adminLabel") : t("appLabel")}
        onNavigate={onNavigate}
      />

      <div className="mt-auto flex flex-col gap-4">
        {area === "reader" && <UsageCard />}
        <div className="flex flex-col gap-2">
          <AreaSwitch area={area} onNavigate={onNavigate} />
          <BackToSite onNavigate={onNavigate} />
          <LocaleSwitcher placement="up" align="start" appearance="outline" />
        </div>

        <div className="flex items-center gap-2.5 border-t border-border px-1 pt-3">
          <Avatar name={user?.name} email={user?.email} highlight />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-sm font-medium">
              {user?.name || user?.email}
            </span>
            <span className="truncate text-xs text-text-secondary">
              {user?.email}
            </span>
          </span>
          <button
            type="button"
            onClick={() => logout()}
            aria-label={t("logOut")}
            title={t("logOut")}
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
  const t = useTranslations("nav");
  const { user } = useAuth();
  const links = useNavEntries(area);
  return (
    <div className="flex h-full flex-col items-center gap-5 px-3 py-4">
      <Link
        href={HOME_HREF[area]}
        aria-label={t("zaydounHome")}
        className="rounded-sm"
      >
        <Image
          src="/logo.png"
          alt=""
          width={36}
          height={36}
          className="rounded-[9px]"
        />
      </Link>
      <SidebarNav links={links} ariaLabel={t("appLabel")} collapsed />
      <div className="mt-auto flex flex-col gap-2">
        <AreaSwitch area={area} collapsed />
        <BackToSite collapsed />
        <LocaleSwitcher
          placement="up"
          align="start"
          appearance="outline"
          compact
        />
      </div>
      <Link
        href={area === "admin" ? "/dashboard/profile" : "/app/profile"}
        aria-label={t("profile")}
        className="rounded-full"
      >
        <Avatar name={user?.name} email={user?.email} highlight />
      </Link>
    </div>
  );
}
