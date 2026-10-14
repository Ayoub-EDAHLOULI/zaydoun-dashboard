"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { DailyUsage, UsagePeriod } from "@/types/users.types";
import { formatUsd } from "./format";

interface Bucket {
  key: string;
  label: string;
  /** Full label for tooltips and the table */
  longLabel: string;
  cost: number;
  messages: number;
  isCurrent: boolean;
}

const DAY_MS = 86_400_000;
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

// One bar per day for the period, filling the days with no usage with 0.
// "All time" spanning more than ~2 months is grouped by month instead.
function toBuckets(daily: DailyUsage[], period: UsagePeriod): Bucket[] {
  const byDay = new Map(daily.map((d) => [d.date, d]));
  const today = new Date();
  const todayKey = isoDay(today);

  const span =
    period === "day"
      ? 1
      : period === "week"
        ? 7
        : period === "month"
          ? 30
          : daily.length
            ? Math.ceil((today.getTime() - new Date(daily[0].date).getTime()) / DAY_MS) + 1
            : 7;

  if (period === "all" && span > 62) {
    const months = new Map<string, Bucket>();
    for (const d of daily) {
      const key = d.date.slice(0, 7);
      const date = new Date(`${d.date}T00:00:00`);
      const b = months.get(key) ?? {
        key,
        label: date.toLocaleDateString(undefined, { month: "short" }),
        longLabel: date.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        cost: 0,
        messages: 0,
        isCurrent: key === todayKey.slice(0, 7),
      };
      b.cost += d.cost;
      b.messages += d.messages;
      months.set(key, b);
    }
    return [...months.values()];
  }

  return Array.from({ length: span }, (_, i) => {
    const date = new Date(today.getTime() - (span - 1 - i) * DAY_MS);
    const key = isoDay(date);
    const d = byDay.get(key);
    const isCurrent = key === todayKey;
    return {
      key,
      label: isCurrent
        ? "Today"
        : span <= 7
          ? date.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })
          : date.toLocaleDateString(undefined, { day: "numeric" }),
      longLabel: date.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      cost: d?.cost ?? 0,
      messages: d?.messages ?? 0,
      isCurrent,
    };
  });
}

// A "nice" axis maximum (1, 2, 2.5 or 5 × 10^n) and four even ticks
function niceTicks(max: number): number[] {
  if (max <= 0) return [0, 0.25, 0.5, 0.75, 1].map((t) => t * 0.01);
  const exp = Math.floor(Math.log10(max));
  const base = 10 ** exp;
  const step = [1, 2, 2.5, 5, 10].find((m) => m * base >= max)! * base;
  return [0, 0.25, 0.5, 0.75, 1].map((t) => t * step);
}

const PLOT_HEIGHT = 220;

export function CostPerDayChart({
  daily,
  period,
}: {
  daily: DailyUsage[];
  period: UsagePeriod;
}) {
  const [asTable, setAsTable] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  const buckets = useMemo(() => toBuckets(daily, period), [daily, period]);
  const ticks = niceTicks(Math.max(...buckets.map((b) => b.cost), 0));
  const top = ticks[ticks.length - 1];
  const peak = buckets.reduce<Bucket | null>(
    (best, b) => (b.cost > 0 && (!best || b.cost > best.cost) ? b : best),
    null,
  );
  // Few bars → room for every x label; many → label every few
  const labelEvery = buckets.length <= 10 ? 1 : Math.ceil(buckets.length / 8);

  return (
    <figure className="flex min-w-0 flex-[2_1_520px] flex-col gap-5 rounded-md border border-border bg-bg-surface p-6">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="text-base font-semibold">
          {buckets.length > 31 ? "Cost per month" : "Cost per day"}
        </span>
        <span className="flex items-baseline gap-3 text-[13px] text-text-secondary">
          USD
          <button
            type="button"
            onClick={() => setAsTable((v) => !v)}
            aria-pressed={asTable}
            className="rounded-xs text-gold-light hover:text-text-primary"
          >
            {asTable ? "View as chart" : "View as table"}
          </button>
        </span>
      </figcaption>

      {asTable ? (
        <div className="max-h-[260px] overflow-y-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-left text-xs text-text-secondary">
                <th scope="col" className="pb-2 font-medium">Day</th>
                <th scope="col" className="pb-2 text-right font-medium">Messages</th>
                <th scope="col" className="pb-2 text-right font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((b) => (
                <tr key={b.key} className="border-t border-border-subtle">
                  <td className="py-2">{b.longLabel}</td>
                  <td className="py-2 text-right text-text-secondary">{b.messages}</td>
                  <td className="py-2 text-right">{formatUsd(b.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-3" role="group" aria-label="Cost per day chart">
          {/* Y axis */}
          <div
            aria-hidden
            className="flex w-12 shrink-0 flex-col-reverse justify-between text-right text-xs text-text-secondary tabular-nums"
            style={{ height: PLOT_HEIGHT }}
          >
            {ticks.map((t) => (
              <span key={t} className="-my-2 leading-4">
                {formatUsd(t, true)}
              </span>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
            {/* Hairline grid, baseline one step stronger */}
            <div aria-hidden className="absolute inset-x-0 top-0" style={{ height: PLOT_HEIGHT }}>
              {ticks.map((t, i) => (
                <div
                  key={t}
                  className={cn(
                    "absolute inset-x-0 border-t",
                    i === 0 ? "border-border" : "border-border-subtle",
                  )}
                  style={{ bottom: `${(i / (ticks.length - 1)) * 100}%` }}
                />
              ))}
            </div>

            {/* Bars — the whole column is the hover/focus target */}
            <div className="relative flex" style={{ height: PLOT_HEIGHT }}>
              {buckets.map((b) => {
                const h = top > 0 ? (b.cost / top) * PLOT_HEIGHT : 0;
                const labelled = b.isCurrent || b.key === peak?.key;
                const active = hover === b.key;
                return (
                  <button
                    key={b.key}
                    type="button"
                    aria-label={`${b.longLabel}: ${formatUsd(b.cost)}, ${b.messages} messages`}
                    onMouseEnter={() => setHover(b.key)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(b.key)}
                    onBlur={() => setHover(null)}
                    className="group relative flex h-full min-w-0 flex-1 items-end justify-center px-px focus-visible:outline-offset-0"
                  >
                    {b.cost > 0 && (
                      <span
                        className={cn(
                          "block w-full max-w-6 rounded-t-xs transition-opacity",
                          b.isCurrent ? "bg-gold" : "bg-gold-chart",
                          hover && !active && "opacity-60",
                        )}
                        style={{ height: Math.max(h, 2) }}
                      />
                    )}
                    {labelled && b.cost > 0 && !active && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap text-text-primary tabular-nums"
                        style={{ bottom: Math.max(h, 2) + 6 }}
                      >
                        {formatUsd(b.cost)}
                      </span>
                    )}
                    {active && (
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 flex-col gap-0.5 rounded-sm bg-bg-overlay px-3 py-2 text-left text-xs whitespace-nowrap shadow-overlay"
                        style={{ bottom: Math.max(h, 2) + 8 }}
                      >
                        <span className="text-text-secondary">{b.longLabel}</span>
                        <span className="font-semibold text-text-primary tabular-nums">
                          {formatUsd(b.cost)} · {b.messages} messages
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* X labels */}
            <div aria-hidden className="mt-3 flex text-xs text-text-secondary">
              {buckets.map((b, i) => (
                <span
                  key={b.key}
                  className={cn(
                    "min-w-0 flex-1 truncate text-center",
                    b.isCurrent && "font-medium text-text-primary",
                  )}
                >
                  {i % labelEvery === 0 || b.isCurrent ? b.label : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
