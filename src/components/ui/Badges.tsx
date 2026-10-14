import { Bookmark, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { BookStatus } from "@/types/books.types";
import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// StatusBadge — always a word + a color; Processing also spins
// ---------------------------------------------------------------------------

const STATUS: Record<
  BookStatus,
  { label: string; text: string; tint: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    text: "text-info-text",
    tint: "bg-info/12",
    dot: "bg-info",
  },
  PROCESSING: {
    label: "Processing",
    text: "text-warning",
    tint: "bg-warning/12",
    dot: "bg-warning",
  },
  READY: {
    label: "Ready",
    text: "text-success",
    tint: "bg-success/12",
    dot: "bg-success",
  },
  FAILED: {
    label: "Failed",
    text: "text-error-text",
    tint: "bg-error/12",
    dot: "bg-error",
  },
};

export function StatusBadge({
  status,
  overlay = false,
  className,
}: {
  status: BookStatus;
  /** Dark translucent background for sitting on top of a book cover */
  overlay?: boolean;
  className?: string;
}) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-xs px-[9px] text-xs font-medium",
        s.text,
        overlay ? "bg-bg-base/75" : s.tint,
        className,
      )}
    >
      {status === "PROCESSING" ? (
        <LoaderCircle
          size={12}
          strokeWidth={2.4}
          className="animate-spin"
          aria-hidden
        />
      ) : (
        <span className={cn("size-1.5 rounded-full", s.dot)} aria-hidden />
      )}
      {s.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Badge — neutral chips (language) and the gold ADMIN tag
// ---------------------------------------------------------------------------

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-xs border px-[9px] text-xs",
        tone === "gold"
          ? "border-border-gold font-semibold tracking-[0.06em] text-gold-light"
          : "border-border font-medium text-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// PageTag — the page citation chip on Zaydoun's answers
// ---------------------------------------------------------------------------

export function PageTag({
  page,
  arabic = false,
  onClick,
  className,
}: {
  page: number;
  /** Renders "صفحة N" in Amiri for Arabic conversations */
  arabic?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const classes = cn(
    "inline-flex h-[26px] items-center gap-1.5 rounded-full border border-border-gold bg-gold-muted px-2.5 text-gold-light",
    arabic ? "font-arabic text-sm font-medium" : "text-xs font-medium",
    onClick && "transition-colors hover:bg-gold/25",
    className,
  );
  const content = (
    <>
      <Bookmark size={12} aria-hidden />
      {arabic ? `صفحة ${page}` : `Page ${page}`}
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  ) : (
    <span className={classes} dir={arabic ? "rtl" : undefined}>
      {content}
    </span>
  );
}
