"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_NAMES, routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

// Language picker. Switching keeps the current page (and its query string)
// and swaps only the language prefix: /features → /fr/features.
export function LocaleSwitcher({
  placement = "down",
  align = "end",
  compact = false,
  appearance = "ghost",
  className,
}: {
  /** Open the list above the button (sidebar footer) or below it */
  placement?: "up" | "down";
  /** Which edge of the button the list lines up with */
  align?: "start" | "end";
  /** Show only the globe + language code (tight headers) */
  compact?: boolean;
  /** "outline" matches the bordered links at the bottom of the app sidebar */
  appearance?: "ghost" | "outline";
  className?: string;
}) {
  const t = useTranslations("common.language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  // Focus the current language when opening; close on outside click
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLButtonElement>("[aria-checked=true]")
      ?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const choose = (next: Locale) => {
    close();
    if (next === locale) return;
    const { search, hash } = window.location;
    startTransition(() => {
      router.replace(`${pathname}${search}${hash}`, { locale: next });
    });
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]") ??
        [],
    );
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={t("label", { language: LOCALE_NAMES[locale] })}
        disabled={pending}
        className={cn(
          "flex h-11 items-center gap-2 rounded-sm text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:opacity-60",
          compact ? "px-2.5" : "w-full px-3",
          appearance === "outline" &&
            "border border-border hover:border-border-strong",
          appearance === "outline" && compact && "w-11 justify-center px-0",
          open && "bg-bg-elevated text-text-primary",
        )}
      >
        <Globe size={18} aria-hidden className="shrink-0" />
        {compact ? (
          appearance === "ghost" && (
            <span className="text-13 font-medium uppercase">{locale}</span>
          )
        ) : (
          <span className="flex-1 text-start">{LOCALE_NAMES[locale]}</span>
        )}
        {!(compact && appearance === "outline") && (
          <ChevronDown
            size={14}
            aria-hidden
            className={cn("shrink-0 transition-transform", open && "rotate-180")}
          />
        )}
      </button>

      {open && (
        <div
          ref={listRef}
          id={menuId}
          role="menu"
          aria-label={t("choose")}
          onKeyDown={onListKeyDown}
          className={cn(
            "absolute z-[60] flex w-48 flex-col rounded-md border border-border bg-bg-overlay p-1 shadow-overlay",
            placement === "up" ? "bottom-full mb-2" : "top-full mt-2",
            align === "end" ? "end-0" : "start-0",
          )}
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              lang={l}
              onClick={() => choose(l)}
              className={cn(
                "flex h-10 items-center gap-2.5 rounded-sm px-3 text-start text-sm transition-colors hover:bg-bg-elevated focus-visible:outline-offset-0",
                l === locale ? "text-gold-light" : "text-text-primary",
              )}
            >
              <span className="flex-1">{LOCALE_NAMES[l]}</span>
              {l === locale && <Check size={16} aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
