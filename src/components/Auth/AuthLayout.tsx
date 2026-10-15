"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Input, Orb, type InputProps } from "@/components/ui";
import { cn } from "@/lib/cn";

const YEAR = new Date().getFullYear();

function Logo({ size = 36 }: { size?: number }) {
  return (
    <Link href="/" className="flex w-fit items-center gap-2.5 rounded-sm text-text-primary">
      <Image src="/logo.png" alt="" width={size} height={size} className="rounded-[9px]" />
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
    <div className="flex min-h-screen bg-bg-base">
      <aside className="relative hidden flex-1 flex-col overflow-hidden border-r border-border bg-bg-surface px-16 py-12 lg:flex">
        <Logo />
        <span aria-hidden className="pointer-events-none absolute top-40 -right-36 size-[520px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.14)_0%,transparent_65%)]" />
        {/* Positioned by a wrapper: Orb is relative itself */}
        <div aria-hidden className="pointer-events-none absolute top-[300px] right-5">
          <Orb size={200} rings={1} />
        </div>
        <div className="relative mt-auto flex max-w-[420px] flex-col gap-5">
          <p className="font-serif text-46 leading-[1.08] tracking-[-0.02em] [&_em]:text-gold-light [&_em]:italic">
            {headline}
          </p>
          {aside}
        </div>
        <span className="relative mt-12 text-13 text-text-secondary">
          © {YEAR} Zaydoun
        </span>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col items-center justify-center gap-10 px-4 py-10 md:px-12">
        <div className="w-full max-w-[400px] lg:hidden">
          <Logo size={32} />
        </div>
        <div className="w-full max-w-[400px]">{children}</div>
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-bg-base px-4 py-10">
      <div className="w-full max-w-[440px]">
        <Logo size={32} />
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

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
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
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      end={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="flex size-10 items-center justify-center rounded-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      }
    />
  );
}
