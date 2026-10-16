"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { EASE_OUT, MotionProvider } from "@/components/motion";
import ScrollToTop from "./ScrollToTop";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { buttonClasses, LocaleSwitcher } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/routes";
import { cn } from "@/lib/cn";

// Labels are keys in messages/<locale>/marketing.json → nav
const LINKS = [
  { href: "/features", label: "features" },
  { href: "/how-it-works", label: "howItWorks" },
  { href: "/faq", label: "faq" },
  { href: "/contact", label: "contact" },
] as const;

const YEAR = new Date().getFullYear();

function Logo({ size = 34 }: { size?: number }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-sm text-text-primary"
    >
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        className="rounded-sm"
      />
      <span className="text-lg font-semibold tracking-[-0.01em]">Zaydoun</span>
    </Link>
  );
}

// Log in / Get started — or a way back into the app when signed in
function AccountLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("marketing.nav");
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated && user) {
    return (
      <Link
        href={getDashboardPath(user.role)}
        onClick={onNavigate}
        className={buttonClasses()}
      >
        {t("openLibrary")}
      </Link>
    );
  }
  return (
    <>
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex h-11 items-center rounded-sm px-4 text-15 text-text-primary hover:text-gold-light"
      >
        {t("logIn")}
      </Link>
      <Link href="/register" onClick={onNavigate} className={buttonClasses()}>
        {t("getStarted")}
      </Link>
    </>
  );
}

function MarketingNav() {
  const t = useTranslations("marketing.nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide while reading downwards, come back on any scroll up
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 240 && y > previous && !open);
  });

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur transition-[background-color,border-color] duration-300",
        scrolled
          ? "border-border bg-bg-base/95"
          : "border-border-subtle bg-bg-base/70",
      )}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
    >
      <nav
        aria-label={t("main")}
        className="mx-auto flex h-[76px] max-w-[1200px] items-center gap-8 px-4 md:px-10"
      >
        <Logo />
        <div className="ms-6 hidden gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={cn(
                "flex h-11 items-center rounded-sm px-3.5 text-15 transition-colors hover:text-text-primary",
                pathname === l.href ? "text-gold-light" : "text-text-secondary",
              )}
            >
              {t(l.label)}
            </Link>
          ))}
        </div>
        <div className="ms-auto hidden items-center gap-2 lg:flex">
          <LocaleSwitcher compact />
          <AccountLinks />
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="marketing-menu"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          className="ms-auto flex size-11 items-center justify-center rounded-sm text-text-primary hover:bg-bg-elevated lg:hidden"
        >
          {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="marketing-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden border-t border-border-subtle bg-bg-base px-4 lg:hidden"
          >
            <div className="pb-6">
              <div className="flex flex-col py-2">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center border-b border-border-subtle text-base text-text-primary"
                  >
                    {t(l.label)}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <AccountLinks onNavigate={() => setOpen(false)} />
                <LocaleSwitcher compact placement="up" align="start" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MarketingFooter() {
  const t = useTranslations("marketing.nav");
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-4 py-8 text-sm text-text-secondary md:px-10">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt=""
            width={26}
            height={26}
            className="rounded-[6px]"
          />
          <span className="font-semibold text-text-primary">Zaydoun</span>
        </div>
        <nav aria-label={t("footer")} className="flex flex-wrap gap-6">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-text-primary">
              {t(l.label)}
            </Link>
          ))}
          <Link href="/login" className="hover:text-text-primary">
            {t("logIn")}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher compact placement="up" />
          <span>© {YEAR} Zaydoun</span>
        </div>
      </div>
    </footer>
  );
}

export default function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <div className="flex min-h-screen flex-col bg-bg-base">
        {/* Focus target for "Back to top" */}
        <div id="top" tabIndex={-1} className="outline-none" />
        <MarketingNav />
        <main className="flex-1">{children}</main>
        <MarketingFooter />
        <ScrollToTop />
      </div>
    </MotionProvider>
  );
}

// ---------------------------------------------------------------------------
// Section primitives shared by the marketing pages
// ---------------------------------------------------------------------------

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs font-medium tracking-[0.14em] text-gold uppercase">
      {children}
    </span>
  );
}

/** Serif section title; put the gold italic phrase in <em> */
export function SectionTitle({
  id,
  children,
  as: Tag = "h2",
  size = "lg",
  className,
}: {
  id?: string;
  children: ReactNode;
  as?: "h1" | "h2";
  /** md 44 · lg 52 · page 60–72 (page titles) · xl 84 (home hero) */
  size?: "md" | "lg" | "page" | "xl";
  className?: string;
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-serif font-normal tracking-[-0.02em] [&_em]:text-gold-light [&_em]:italic",
        size === "md" && "text-32 leading-[1.1] md:text-44",
        size === "lg" && "text-40 leading-[1.05] md:text-52",
        size === "page" &&
          "text-46 leading-[1.02] tracking-[-0.03em] md:text-72",
        size === "xl" && "text-46 leading-[1] tracking-[-0.03em] md:text-84",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1200px] px-4 md:px-10", className)}>
      {children}
    </div>
  );
}
