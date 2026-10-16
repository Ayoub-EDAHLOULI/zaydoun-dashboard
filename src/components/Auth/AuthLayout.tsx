"use client";

import { Link } from "@/i18n/navigation";
import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Input, LocaleSwitcher, type InputProps } from "@/components/ui";
import SunScene from "./SunScene";
import { cn } from "@/lib/cn";

const YEAR = new Date().getFullYear();

function Logo({ size = 36 }: { size?: number }) {
  return (
    <Link
      href="/"
      className="flex w-fit items-center gap-2.5 rounded-sm text-text-primary"
    >
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        className="rounded-[9px]"
      />
      <span className="text-19 font-semibold">Zaydoun</span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Split layout (login, register): brand panel + form. The panel is desktop-only.
// ---------------------------------------------------------------------------

export function AuthSplitLayout({
  headline,
  aside,
  children,
}: {
  /** Serif statement on the brand panel; wrap the accent in <em> */
  headline: ReactNode;
  /** Extra content under the headline */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh bg-bg-base">
      <aside className="relative hidden flex-1 flex-col overflow-hidden border-e border-border bg-bg-surface px-16 py-12 lg:flex">
        {/* The sun, its light and the dust in it — behind the text */}
        <SunScene />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative mt-auto flex max-w-[420px] flex-col gap-5">
          <p className="display-leading font-serif text-46 leading-[1.08] tracking-[-0.02em] [&_em]:text-gold-light [&_em]:italic">
            {headline}
          </p>
          {aside}
        </div>
        <span className="relative mt-12 text-13 text-text-secondary">
          © {YEAR} Zaydoun
        </span>
      </aside>

      {/* my-auto on the content centres it when there's room and falls back to
          top-aligned on short screens (justify-center would push the top
          off-screen, out of reach) */}
      <main className="flex min-w-0 flex-1 flex-col items-center gap-7 px-4 py-6 sm:gap-10 sm:py-10 md:px-12">
        <div className="flex w-full max-w-[400px] items-center justify-between gap-4 lg:max-w-none lg:justify-end">
          <span className="lg:hidden">
            <Logo size={32} />
          </span>
          <LocaleSwitcher compact />
        </div>
        <div className="my-auto w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Centred card (forgot / reset password states)
// ---------------------------------------------------------------------------

export function AuthCardLayout({
  eyebrow,
  icon,
  tone = "gold",
  title,
  children,
}: {
  eyebrow: string;
  /** Optional icon tile above the title */
  icon?: ReactNode;
  tone?: "gold" | "success" | "error";
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center gap-7 bg-bg-base px-4 py-6 sm:gap-10 sm:py-10">
      <div className="flex w-full max-w-[440px] items-center justify-between gap-4">
        <Logo size={32} />
        <LocaleSwitcher compact />
      </div>
      <section
        aria-labelledby="auth-card-title"
        className="flex w-full max-w-[440px] flex-col gap-4.5 rounded-lg border border-border bg-bg-surface p-7 md:p-9"
      >
        <span className="text-xs font-medium tracking-[0.1em] text-text-secondary uppercase">
          {eyebrow}
        </span>
        {icon && (
          <span
            className={cn(
              "flex size-[52px] items-center justify-center rounded-[14px]",
              tone === "gold" && "bg-gold-muted text-gold-light",
              tone === "success" && "bg-success/12 text-success",
              tone === "error" && "bg-error/12 text-error-text",
            )}
          >
            {icon}
          </span>
        )}
        <h1
          id="auth-card-title"
          className="font-serif text-30 leading-[1.15] font-normal"
        >
          {title}
        </h1>
        {children}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Heading for the split layout's form
// ---------------------------------------------------------------------------

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-1 flex flex-col gap-2">
      {/* Forms reference this id via aria-labelledby="auth-title" */}
      <h1
        id="auth-title"
        className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40"
      >
        {title}
      </h1>
      <p className="text-15 text-text-secondary">{subtitle}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Password field with a show / hide toggle
// ---------------------------------------------------------------------------

export function PasswordInput(props: Omit<InputProps, "type" | "end">) {
  const t = useTranslations("auth");
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      end={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          aria-pressed={visible}
          className="flex size-10 items-center justify-center rounded-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          {visible ? (
            <EyeOff size={18} aria-hidden />
          ) : (
            <Eye size={18} aria-hidden />
          )}
        </button>
      }
    />
  );
}
