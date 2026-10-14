"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Ellipsis, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  /** e.g. "More actions for Al-Muqaddimah" */
  ariaLabel: string;
  /** "boxed" sits next to a button (book card); "plain" for table rows */
  appearance?: "boxed" | "plain";
}

const MENU_WIDTH = 200;

// The "…" menu. Rendered in a portal so cards with overflow-hidden don't clip it.
export function ActionMenu({
  items,
  ariaLabel,
  appearance = "boxed",
}: ActionMenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  // Position under the trigger, right-aligned; flip above if no room below
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? 0;
    const below = r.bottom + 6 + menuHeight <= window.innerHeight;
    setPos({
      top: below ? r.bottom + 6 : r.top - 6 - menuHeight,
      left: Math.max(8, r.right - MENU_WIDTH),
    });
    menuRef.current
      ?.querySelector<HTMLButtonElement>("[role=menuitem]:not(:disabled)")
      ?.focus();
  }, [open]);

  // Close on outside click, scroll or resize
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !triggerRef.current?.contains(t))
        close(false);
    };
    const onDismiss = () => close(false);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("scroll", onDismiss, true);
    window.addEventListener("resize", onDismiss);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onDismiss, true);
      window.removeEventListener("resize", onDismiss);
    };
  }, [open, close]);

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        "[role=menuitem]:not(:disabled)",
      ) ?? [],
    );
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      buttons[(i + 1) % buttons.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      buttons[(i - 1 + buttons.length) % buttons.length]?.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-sm text-text-secondary transition-colors hover:text-text-primary",
          appearance === "boxed"
            ? "border border-border bg-bg-elevated hover:bg-bg-overlay"
            : "hover:bg-bg-overlay",
          open && "bg-bg-overlay text-text-primary",
        )}
      >
        <Ellipsis size={18} aria-hidden />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={ariaLabel}
            onKeyDown={onMenuKeyDown}
            className="fixed z-[60] flex flex-col rounded-md bg-bg-overlay p-1 shadow-overlay"
            style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    close();
                    item.onSelect();
                  }}
                  className={cn(
                    "flex h-10 items-center gap-2.5 rounded-sm px-3 text-left text-sm transition-colors focus-visible:outline-offset-0 disabled:cursor-not-allowed disabled:text-text-disabled",
                    item.destructive
                      ? "text-error-text enabled:hover:bg-error/12"
                      : "text-text-primary enabled:hover:bg-bg-elevated",
                  )}
                >
                  {Icon && <Icon size={16} aria-hidden />}
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
