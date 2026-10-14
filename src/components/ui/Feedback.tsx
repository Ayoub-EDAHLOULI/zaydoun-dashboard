import type { ReactNode } from "react";
import { BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { Orb } from "./Orb";

// ---------------------------------------------------------------------------
// LimitBanner — free-tier limits (shelf full / daily messages used up)
// ---------------------------------------------------------------------------

// The API resets the daily message count at midnight UTC — show that moment
// in the viewer's local time so "back at …" is accurate.
function nextResetTime(): string {
  const reset = new Date();
  reset.setUTCHours(24, 0, 0, 0);
  return reset.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface LimitBannerProps {
  variant: "books" | "messages";
  /** Free-tier allowance, e.g. 2 books or 15 messages */
  limit: number;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function LimitBanner({
  variant,
  limit,
  title,
  description,
  action,
  className,
}: LimitBannerProps) {
  const Icon = variant === "books" ? BookOpen : Clock;
  const defaultTitle =
    variant === "books"
      ? `Your shelf is full: ${limit} of ${limit} free books`
      : `You've used today's ${limit} messages`;
  const defaultDescription =
    variant === "books"
      ? "Delete a book from its ··· menu to make room for another one."
      : `Zaydoun will be back at ${nextResetTime()}. Past conversations stay open to read.`;

  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center gap-4 rounded-md border border-border-gold bg-bg-surface px-5 py-4",
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-gold-muted text-gold-light">
        <Icon size={20} aria-hidden />
      </span>
      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-0.5">
        <span className="text-[15px] font-semibold">
          {title ?? defaultTitle}
        </span>
        {/* The reset time depends on the viewer's timezone */}
        <span className="text-sm text-text-secondary" suppressHydrationWarning>
          {description ?? defaultDescription}
        </span>
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState — small orb, serif title, one line, optional action
// ---------------------------------------------------------------------------

export function EmptyState({
  title,
  description,
  action,
  bordered = true,
  className,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  /** Card look (surface + border). Off when already inside a card. */
  bordered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3.5 px-7 py-10 text-center",
        bordered && "rounded-md border border-border bg-bg-surface",
        className,
      )}
    >
      <Orb size={56} rings={1} muted className="mb-2" />
      <h3 className="font-serif text-[22px] leading-[1.25] font-medium">
        {title}
      </h3>
      {description && (
        <p className="max-w-[300px] text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton — shimmer (switched off under reduced motion by tokens.css)
// ---------------------------------------------------------------------------

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-xs bg-[linear-gradient(90deg,var(--color-bg-elevated)_0%,var(--color-bg-overlay)_50%,var(--color-bg-elevated)_100%)] bg-[length:800px_100%]",
        className,
      )}
    />
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-border bg-bg-surface">
      <div className="h-[200px] border-b border-border bg-border-subtle" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-[18px] w-[70%]" />
        <Skeleton className="h-3 w-[45%]" />
        <div className="mt-2.5 flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-sm" />
          <Skeleton className="size-10 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
