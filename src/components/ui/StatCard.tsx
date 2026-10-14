import { Minus, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  /** Percentage change vs the previous period. Shown neutrally — no green/red. */
  delta?: number | null;
  /** e.g. "vs previous 7 days" */
  comparison?: string;
  className?: string;
}

// Used for both the reader stats (no delta) and the admin KPIs (with delta)
export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  comparison,
  className,
}: StatCardProps) {
  const hasDelta = delta !== undefined && delta !== null;
  const DeltaIcon = !hasDelta
    ? null
    : delta > 0
      ? TrendingUp
      : delta < 0
        ? TrendingDown
        : Minus;

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-md border border-border bg-bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-text-secondary">
          {label}
        </span>
        {Icon && <Icon size={18} className="text-text-muted" aria-hidden />}
      </div>
      <span className="text-4xl leading-none font-medium tracking-[-0.02em] tabular-nums">
        {value}
      </span>
      {(hasDelta || comparison) && (
        <div className="flex items-center gap-2 text-[13px]">
          {hasDelta && DeltaIcon && (
            <span className="inline-flex items-center gap-1 font-medium text-text-primary">
              <DeltaIcon size={14} aria-hidden />
              <span className="sr-only">
                {delta > 0 ? "up" : delta < 0 ? "down" : "no change"}
              </span>
              {Math.abs(Math.round(delta))}%
            </span>
          )}
          {comparison && (
            <span className="text-text-secondary">{comparison}</span>
          )}
        </div>
      )}
    </div>
  );
}

export { StatCard as KpiCard };
