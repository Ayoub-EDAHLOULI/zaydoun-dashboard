"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trash2, X, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMediaQuery, MOBILE_QUERY } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Input } from "./Field";

const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

// ---------------------------------------------------------------------------
// Modal — centred dialog on desktop, bottom sheet below 768px
// ---------------------------------------------------------------------------

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Rendered as the dialog heading. Omit to render your own (pass labelledBy). */
  title?: ReactNode;
  description?: ReactNode;
  /** id of your own heading when `title` is omitted */
  labelledBy?: string;
  children?: ReactNode;
  /** Buttons row, right-aligned */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Disable closing while something is saving */
  dismissible?: boolean;
}

const noop = () => () => {};

// False on the server and during hydration, true afterwards
function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

const WIDTHS = { sm: "md:max-w-[440px]", md: "md:max-w-[520px]", lg: "md:max-w-[640px]" };

export function Modal({
  open,
  onClose,
  title,
  description,
  labelledBy,
  children,
  footer,
  size = "md",
  dismissible = true,
}: ModalProps) {
  const tc = useTranslations("common");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reduceMotion = useReducedMotion();
  const isClient = useIsClient();

  // Lock page scroll, focus the first control, restore focus on close
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const first = panel?.querySelector<HTMLElement>(
        `[data-autofocus], ${FOCUSABLE}`,
      );
      (first ?? panel)?.focus();
    });
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  // Escape closes; Tab stays inside the dialog
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && dismissible) {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const hidden = isMobile ? { y: "100%" } : { opacity: 0, y: 12, scale: 0.98 };
  const shown = isMobile ? { y: 0 } : { opacity: 1, y: 0, scale: 1 };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6"
          onKeyDown={onKeyDown}
        >
          <motion.div
            className="absolute inset-0 bg-bg-base/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            onClick={dismissible ? onClose : undefined}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : labelledBy}
            tabIndex={-1}
            initial={reduceMotion ? false : hidden}
            animate={shown}
            exit={reduceMotion ? undefined : hidden}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn(
              "relative flex max-h-[92vh] w-full flex-col gap-5 overflow-y-auto bg-bg-overlay p-6 shadow-overlay focus:outline-none md:rounded-lg md:p-7",
              "rounded-t-lg",
              WIDTHS[size],
            )}
          >
            {isMobile && (
              <span
                aria-hidden
                className="mx-auto -mt-2 h-1 w-10 shrink-0 rounded-full bg-border-strong"
              />
            )}
            {title && (
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <h2 id={titleId} className="text-lg font-semibold">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-sm leading-relaxed text-text-secondary">
                      {description}
                    </p>
                  )}
                </div>
                {dismissible && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label={tc("close")}
                    className="-mt-2 -me-2 flex size-10 shrink-0 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                  >
                    <X size={18} aria-hidden />
                  </button>
                )}
              </div>
            )}
            {children}
            {footer && (
              <div className="flex flex-col-reverse gap-2.5 md:flex-row md:justify-end">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// ConfirmDialog — destructive confirms get a red icon tile.
// `requireText` makes the user type a word (e.g. "DELETE") first.
// ---------------------------------------------------------------------------

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "destructive" | "default";
  icon?: LucideIcon;
  requireText?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "destructive",
  icon,
  requireText,
}: ConfirmDialogProps) {
  const tc = useTranslations("common");
  const titleId = useId();
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const Icon = icon ?? (tone === "destructive" ? Trash2 : null);

  // Reset when reopened (adjusting state during render, not in an effect)
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTyped("");
      setBusy(false);
    }
  }

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  const blocked = !!requireText && typed !== requireText;

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      size="sm"
      dismissible={!busy}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {cancelLabel ?? tc("cancel")}
          </Button>
          <Button
            variant={tone === "destructive" ? "destructive" : "primary"}
            onClick={confirm}
            loading={busy}
            disabled={blocked}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        {Icon && (
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-md",
              tone === "destructive"
                ? "bg-error/12 text-error-text"
                : "bg-gold-muted text-gold-light",
            )}
          >
            <Icon size={20} aria-hidden />
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          {description && (
            <div className="text-sm leading-relaxed text-text-secondary">
              {description}
            </div>
          )}
        </div>
      </div>
      {requireText && (
        <Input
          label={tc.rich("typeToConfirm", {
            text: requireText,
            b: (chunks) => (
              <span className="font-semibold text-text-primary">{chunks}</span>
            ),
          })}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          data-autofocus
        />
      )}
    </Modal>
  );
}
