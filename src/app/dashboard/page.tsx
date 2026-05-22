"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Coins,
  MessageSquare,
  BookOpen,
  Mic,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { usersService } from "@/lib/api/services/users.service";
import { UsageStats, UsagePeriod, DailyUsage } from "@/types/users.types";
import { useToast } from "@/contexts/ToastContext";

const CostChart = dynamic(() => import("@/components/Dashboard/CostChart"), {
  ssr: false,
  loading: () => (
    <div
      className="h-45 rounded-xl animate-pulse"
      style={{ backgroundColor: "var(--z-bg-overlay)" }}
    />
  ),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt$(n: number): string {
  if (n < 0.001) return "<$0.001";
  if (n < 1) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(2)}`;
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

function fmtAudio(secs: number): string {
  if (secs < 60) return `${Math.round(secs)}s`;
  return `${Math.round(secs / 60)}m`;
}

function shortDate(iso: string, period: UsagePeriod): string {
  const d = new Date(iso);
  if (period === "day")
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (period === "month" || period === "all")
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  return d.toLocaleDateString([], { weekday: "short", day: "numeric" });
}

// ── Period tabs ───────────────────────────────────────────────────────────────

const PERIODS: { value: UsagePeriod; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "7 days" },
  { value: "month", label: "30 days" },
  { value: "all", label: "All time" },
];

function PeriodTabs({
  value,
  onChange,
}: {
  value: UsagePeriod;
  onChange: (p: UsagePeriod) => void;
}) {
  return (
    <div
      className="inline-flex rounded-xl p-1 gap-1"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: "1px solid var(--z-border)",
      }}
    >
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
          style={
            value === p.value
              ? {
                  backgroundColor: "var(--z-gold-muted)",
                  color: "var(--z-gold)",
                  border: "1px solid var(--z-border-gold)",
                }
              : {
                  color: "var(--z-text-muted)",
                  border: "1px solid transparent",
                }
          }
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

// ── Delta chip ────────────────────────────────────────────────────────────────

function Delta({ value }: { value: number | null }) {
  if (value === null) return null;
  const up = value > 0;
  const flat = Math.abs(value) < 0.5;
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
  const color = flat
    ? "var(--z-text-muted)"
    : up
      ? "var(--z-error)"
      : "var(--z-success)";
  const bg = flat
    ? "var(--z-bg-overlay)"
    : up
      ? "rgba(224,92,92,0.1)"
      : "rgba(76,175,125,0.1)";

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
      style={{ color, backgroundColor: bg }}
    >
      <Icon className="w-3 h-3" />
      {flat ? "~0%" : `${up ? "+" : ""}${value.toFixed(1)}%`}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delta,
  gold,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  delta?: number | null;
  gold?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: `1px solid ${gold ? "var(--z-border-gold)" : "var(--z-border)"}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--z-gold-muted)",
            border: "1px solid var(--z-border-gold)",
          }}
        >
          <Icon className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
        </div>
        {delta !== undefined && <Delta value={delta ?? null} />}
      </div>
      <div>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--z-text-primary)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--z-text-muted)" }}>
          {label}
        </p>
        {sub && (
          <p
            className="text-xs mt-1"
            style={{ color: "var(--z-text-secondary)" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Top conversations table ───────────────────────────────────────────────────

function TopConversations({ stats }: { stats: UsageStats }) {
  if (!stats.topConversations.length) return null;
  const maxCost = Math.max(
    ...stats.topConversations.map((c) => c.cost),
    0.0001,
  );

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: "1px solid var(--z-border)",
      }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid var(--z-border)" }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--z-text-primary)" }}
        >
          Top conversations by cost
        </p>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--z-border)" }}>
        {stats.topConversations.map((c, i) => (
          <div key={c.id} className="px-5 py-3 flex items-center gap-4">
            <span
              className="text-xs font-bold w-5 text-center shrink-0"
              style={{ color: "var(--z-text-muted)" }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: "var(--z-text-primary)" }}
              >
                {c.title ?? "Untitled"}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-xs truncate"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  {c.bookTitle}
                </span>
                <span
                  className="text-xs shrink-0"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  · {c.messageCount} msgs
                </span>
              </div>
              {/* Cost bar */}
              <div
                className="mt-1.5 h-1 rounded-full w-full"
                style={{ backgroundColor: "var(--z-bg-overlay)" }}
              >
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: `${(c.cost / maxCost) * 100}%`,
                    backgroundColor: "var(--z-gold)",
                  }}
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--z-gold)" }}
              >
                {fmt$(c.cost)}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--z-text-muted)" }}
              >
                {fmtTokens(c.inputTokens + c.outputTokens)} tok
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Token breakdown bar ───────────────────────────────────────────────────────

function TokenBreakdown({ stats }: { stats: UsageStats }) {
  const total = stats.totalInputTokens + stats.totalOutputTokens;
  if (total === 0) return null;
  const inputPct = (stats.totalInputTokens / total) * 100;
  const outputPct = (stats.totalOutputTokens / total) * 100;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: "1px solid var(--z-border)",
      }}
    >
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--z-text-primary)" }}
      >
        Token breakdown
      </p>
      <div
        className="flex rounded-full overflow-hidden h-3"
        style={{ backgroundColor: "var(--z-bg-overlay)" }}
      >
        <div
          style={{ width: `${inputPct}%`, backgroundColor: "var(--z-info)" }}
        />
        <div
          style={{ width: `${outputPct}%`, backgroundColor: "var(--z-gold)" }}
        />
      </div>
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: "var(--z-info)" }}
          />
          <span style={{ color: "var(--z-text-muted)" }}>
            Input — {fmtTokens(stats.totalInputTokens)} ({inputPct.toFixed(0)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0"
            style={{ backgroundColor: "var(--z-gold)" }}
          />
          <span style={{ color: "var(--z-text-muted)" }}>
            Output — {fmtTokens(stats.totalOutputTokens)} (
            {outputPct.toFixed(0)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { notify } = useToast();
  const [period, setPeriod] = useState<UsagePeriod>("week");
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(
    async (p: UsagePeriod) => {
      setIsLoading(true);
      try {
        const data = await usersService.getStats(p);
        setStats(data);
      } catch (err: unknown) {
        notify(
          err instanceof Error ? err.message : "Failed to load stats",
          "error",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [notify],
  );

  useEffect(() => {
    const run = async () => {
      await load(period);
    };
    void run();
  }, [load, period]);

  const handlePeriod = (p: UsagePeriod) => {
    setPeriod(p);
  };

  // ── Render ──

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-48">
        <div
          className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{
            borderColor: "var(--z-gold)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  const chartData: (DailyUsage & { label: string })[] = (
    stats?.dailyBreakdown ?? []
  ).map((d) => ({
    ...d,
    label: shortDate(d.date, period),
  }));

  const hasChart = chartData.length > 1;

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <PeriodTabs value={period} onChange={handlePeriod} />
        {isLoading && (
          <div
            className="w-5 h-5 rounded-full border-2 animate-spin"
            style={{
              borderColor: "var(--z-gold)",
              borderTopColor: "transparent",
            }}
          />
        )}
      </div>

      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Coins}
              label="Total cost"
              value={fmt$(stats.totalCost)}
              delta={stats.costDelta}
              gold
            />
            <StatCard
              icon={MessageSquare}
              label="Messages"
              value={stats.totalMessages.toLocaleString()}
              sub={`${stats.totalConversations} conversation${stats.totalConversations !== 1 ? "s" : ""}`}
              delta={stats.messagesDelta}
            />
            <StatCard
              icon={BookOpen}
              label="Tokens used"
              value={fmtTokens(
                stats.totalInputTokens + stats.totalOutputTokens,
              )}
              sub={`${fmtTokens(stats.totalInputTokens)} in · ${fmtTokens(stats.totalOutputTokens)} out`}
            />
            <StatCard
              icon={Mic}
              label="Audio processed"
              value={fmtAudio(stats.totalAudioSeconds)}
              sub="Whisper STT"
            />
          </div>

          {/* Cost over time chart */}
          {hasChart && (
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "var(--z-bg-surface)",
                border: "1px solid var(--z-border)",
              }}
            >
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--z-text-primary)" }}
              >
                Cost over time
              </p>
              <CostChart data={chartData} />
            </div>
          )}

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TokenBreakdown stats={stats} />
            <TopConversations stats={stats} />
          </div>

          {/* Zero state */}
          {stats.totalMessages === 0 && (
            <div
              className="rounded-xl p-10 flex flex-col items-center gap-3 text-center"
              style={{
                backgroundColor: "var(--z-bg-surface)",
                border: "1px dashed var(--z-border)",
              }}
            >
              <Coins
                className="w-8 h-8"
                style={{ color: "var(--z-text-muted)" }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: "var(--z-text-primary)" }}
              >
                No usage for this period
              </p>
              <p className="text-xs" style={{ color: "var(--z-text-muted)" }}>
                Start a voice conversation from the library to see your
                analytics here.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
