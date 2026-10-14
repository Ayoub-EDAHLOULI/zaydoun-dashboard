"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, AudioLines, Coins, Cpu, MessagesSquare } from "lucide-react";
import {
  DataTable,
  EmptyState,
  SegmentedControl,
  Skeleton,
  StatCard,
  type DataTableColumn,
} from "@/components/ui";
import { usersService } from "@/lib/api/services/users.service";
import { useToast } from "@/contexts/ToastContext";
import type { ConversationUsage, UsagePeriod, UsageStats } from "@/types/users.types";
import { CostPerDayChart } from "./CostPerDayChart";
import { formatCompact, formatDuration, formatUsd } from "./format";

const PERIODS: { value: UsagePeriod; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "7 days" },
  { value: "month", label: "30 days" },
  { value: "all", label: "All time" },
];

const COMPARISON: Record<UsagePeriod, string | undefined> = {
  day: "vs yesterday",
  week: "vs previous 7 days",
  month: "vs previous 30 days",
  all: undefined,
};

function rangeLabel(period: UsagePeriod): string {
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const today = new Date();
  if (period === "day") return "today";
  if (period === "all") return "all time";
  const from = new Date();
  from.setDate(today.getDate() - (period === "week" ? 6 : 29));
  return `${fmt(from)} – ${fmt(today)}`;
}

// ---------------------------------------------------------------------------
// Where the money goes — part-to-whole, one hue, sorted largest first
// ---------------------------------------------------------------------------

function CostBySource({ stats }: { stats: UsageStats }) {
  const rows = [
    { label: "Answers (LLM)", value: stats.costBySource.answers },
    { label: "Voice in (Whisper)", value: stats.costBySource.whisper },
    { label: "Voice out (TTS)", value: stats.costBySource.tts },
  ].sort((a, b) => b.value - a.value);
  const total = stats.totalCost;

  return (
    <figure className="flex min-w-0 flex-[1_1_280px] flex-col gap-5 rounded-md border border-border bg-bg-surface p-6">
      <figcaption className="text-base font-semibold">Where the money goes</figcaption>
      <div className="flex flex-col gap-[18px]">
        {rows.map((r) => {
          const pct = total > 0 ? (r.value / total) * 100 : 0;
          return (
            <div key={r.label} className="flex flex-col gap-2">
              <div className="flex justify-between gap-3 text-sm">
                <span>{r.label}</span>
                <span className="tabular-nums">
                  {formatUsd(r.value)}
                  <span className="ml-2 text-text-secondary">{Math.round(pct)}%</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-bg-elevated">
                <div
                  className="h-2 rounded-full bg-gold"
                  style={{ width: `${pct}%`, minWidth: r.value > 0 ? 4 : 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-auto text-13 leading-normal text-text-secondary">
        Indexing books isn&apos;t included: the API doesn&apos;t log embedding costs yet.
      </p>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Most expensive conversations
// ---------------------------------------------------------------------------

const columns: DataTableColumn<ConversationUsage>[] = [
  {
    key: "conversation",
    header: "Conversation",
    cell: (c) => (
      <span dir="auto" className="block truncate font-medium">
        {c.title?.trim() || `About ${c.bookTitle}`}
      </span>
    ),
  },
  {
    key: "reader",
    header: "Reader",
    cell: (c) => <span className="block truncate text-text-secondary">{c.readerName}</span>,
  },
  {
    key: "book",
    header: "Book",
    cell: (c) => (
      <span dir="auto" className="block truncate text-text-secondary">
        {c.bookTitle}
      </span>
    ),
  },
  {
    key: "messages",
    header: "Messages",
    className: "text-right tabular-nums",
    cell: (c) => c.messageCount,
  },
  {
    key: "tokens",
    header: "Tokens",
    className: "text-right tabular-nums",
    cell: (c) => formatCompact(c.inputTokens + c.outputTokens),
  },
  {
    key: "audio",
    header: "Audio",
    className: "text-right tabular-nums",
    cell: (c) => (c.audioSeconds > 0 ? formatDuration(c.audioSeconds) : "—"),
  },
  {
    key: "cost",
    header: "Cost",
    className: "text-right tabular-nums font-semibold",
    cell: (c) => formatUsd(c.cost),
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OverviewView() {
  const { notify } = useToast();
  const [period, setPeriod] = useState<UsagePeriod>("week");
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loadedPeriod, setLoadedPeriod] = useState<UsagePeriod | null>(null);

  useEffect(() => {
    let cancelled = false;
    usersService
      .getPlatformStats(period)
      .then((data) => {
        if (cancelled) return;
        setStats(data);
        setLoadedPeriod(period);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          notify(err instanceof Error ? err.message : "Couldn't load usage", "error");
      });
    return () => {
      cancelled = true;
    };
  }, [period, notify]);

  const loading = loadedPeriod !== period;
  const comparison = COMPARISON[period];

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40">
            Overview
          </h1>
          <p className="text-sm text-text-secondary">
            Usage and cost across all readers · {rangeLabel(period)}
          </p>
        </div>
        <SegmentedControl ariaLabel="Period" value={period} onChange={setPeriod} options={PERIODS} />
      </header>

      {!stats ? (
        <OverviewSkeleton />
      ) : (
        <div
          className="flex flex-col gap-7 transition-opacity"
          style={{ opacity: loading ? 0.6 : 1 }}
          aria-busy={loading}
        >
          <section
            aria-label="Key numbers"
            className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
          >
            <StatCard
              label="Total cost"
              icon={Coins}
              value={formatUsd(stats.totalCost)}
              delta={comparison ? stats.costDelta : undefined}
              // "vs previous 7 days" only means something next to a percentage
              comparison={comparison && stats.costDelta !== null ? comparison : undefined}
            />
            <StatCard
              label="Messages"
              icon={MessagesSquare}
              value={stats.totalMessages.toLocaleString()}
              delta={comparison ? stats.messagesDelta : undefined}
              comparison={`in ${stats.totalConversations} conversation${stats.totalConversations === 1 ? "" : "s"}`}
            />
            <StatCard
              label="Tokens used"
              icon={Cpu}
              value={formatCompact(stats.totalInputTokens + stats.totalOutputTokens)}
              delta={comparison ? stats.tokensDelta : undefined}
              comparison={`${formatCompact(stats.totalInputTokens)} in · ${formatCompact(stats.totalOutputTokens)} out`}
            />
            <StatCard
              label="Audio processed"
              icon={AudioLines}
              value={formatDuration(stats.totalAudioSeconds)}
              delta={comparison ? stats.audioDelta : undefined}
              comparison="voice, from mobile"
            />
          </section>

          {stats.totalMessages === 0 ? (
            <EmptyState
              title="A quiet stretch"
              description="Nobody has talked to Zaydoun in this period. Try a longer range."
              className="py-14"
            />
          ) : (
            <>
              <section className="flex flex-wrap gap-4">
                <CostPerDayChart daily={stats.dailyBreakdown} period={period} />
                <CostBySource stats={stats} />
              </section>

              <section
                aria-labelledby="top-conversations"
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 id="top-conversations" className="text-base font-semibold">
                    Most expensive conversations
                  </h2>
                  <Link
                    href="/dashboard/conversations"
                    className="inline-flex items-center gap-1.5 rounded-xs text-sm text-gold-light hover:text-text-primary"
                  >
                    All conversations <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
                <DataTable
                  ariaLabel="Most expensive conversations"
                  columns={columns}
                  rows={stats.topConversations}
                  rowKey={(c) => c.id}
                  template="2fr 1.2fr 1.2fr 0.8fr 0.8fr 0.7fr 0.8fr"
                />
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-7" aria-busy>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-4 rounded-md border border-border bg-bg-surface p-5">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[320px] rounded-md" />
    </div>
  );
}
