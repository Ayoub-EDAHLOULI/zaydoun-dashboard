"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
import { useFormatDate } from "@/lib/time";
import { useAdminFormat } from "./format";

const PERIODS: UsagePeriod[] = ["day", "week", "month", "all"];

// Keys in admin.json → overview.comparison
const COMPARISON: Record<UsagePeriod, "day" | "week" | "month" | undefined> = {
  day: "day",
  week: "week",
  month: "month",
  all: undefined,
};

// ---------------------------------------------------------------------------
// Where the money goes — part-to-whole, one hue, sorted largest first
// ---------------------------------------------------------------------------

function CostBySource({ stats }: { stats: UsageStats }) {
  const t = useTranslations("admin.overview.sources");
  const { usd: formatUsd } = useAdminFormat();
  const rows = [
    { label: t("answers"), value: stats.costBySource.answers },
    { label: t("whisper"), value: stats.costBySource.whisper },
    { label: t("tts"), value: stats.costBySource.tts },
  ].sort((a, b) => b.value - a.value);
  const total = stats.totalCost;

  return (
    <figure className="flex min-w-0 flex-[1_1_280px] flex-col gap-5 rounded-md border border-border bg-bg-surface p-6">
      <figcaption className="text-base font-semibold">{t("title")}</figcaption>
      <div className="flex flex-col gap-[18px]">
        {rows.map((r) => {
          const pct = total > 0 ? (r.value / total) * 100 : 0;
          return (
            <div key={r.label} className="flex flex-col gap-2">
              <div className="flex justify-between gap-3 text-sm">
                <span>{r.label}</span>
                <span className="tabular-nums">
                  {formatUsd(r.value)}
                  <span className="ms-2 text-text-secondary">{Math.round(pct)}%</span>
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
        {t("note")}
      </p>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Most expensive conversations
// ---------------------------------------------------------------------------

function useColumns(): DataTableColumn<ConversationUsage>[] {
  const t = useTranslations("admin.overview.table");
  const tt = useTranslations("conversations.fallbackTitle");
  const fmt = useAdminFormat();
  return [
  {
    key: "conversation",
    header: t("conversation"),
    cell: (c) => (
      <span dir="auto" className="block truncate font-medium">
        {c.title?.trim() || tt("about", { title: c.bookTitle })}
      </span>
    ),
  },
  {
    key: "reader",
    header: t("reader"),
    cell: (c) => <span className="block truncate text-text-secondary">{c.readerName}</span>,
  },
  {
    key: "book",
    header: t("book"),
    cell: (c) => (
      <span dir="auto" className="block truncate text-text-secondary">
        {c.bookTitle}
      </span>
    ),
  },
  {
    key: "messages",
    header: t("messages"),
    className: "text-end tabular-nums",
    cell: (c) => c.messageCount,
  },
  {
    key: "tokens",
    header: t("tokens"),
    className: "text-end tabular-nums",
    cell: (c) => fmt.compact(c.inputTokens + c.outputTokens),
  },
  {
    key: "audio",
    header: t("audio"),
    className: "text-end tabular-nums",
    cell: (c) => (c.audioSeconds > 0 ? fmt.duration(c.audioSeconds) : "—"),
  },
  {
    key: "cost",
    header: t("cost"),
    className: "text-end tabular-nums font-semibold",
    cell: (c) => fmt.usd(c.cost),
  },
  ];
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OverviewView() {
  const t = useTranslations("admin.overview");
  const fmt = useAdminFormat();
  const formatDate = useFormatDate();
  const columns = useColumns();
  const { notify } = useToast();

  const rangeLabel = (p: UsagePeriod): string => {
    const d = (date: Date) => formatDate(date, { month: "short", day: "numeric" });
    const today = new Date();
    if (p === "day") return t("range.today");
    if (p === "all") return t("range.all");
    const from = new Date();
    from.setDate(today.getDate() - (p === "week" ? 6 : 29));
    return `${d(from)} – ${d(today)}`;
  };
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
          notify(err instanceof Error ? err.message : t("loadFailed"), "error");
      });
    return () => {
      cancelled = true;
    };
  }, [period, notify, t]);

  const loading = loadedPeriod !== period;
  const comparisonKey = COMPARISON[period];
  const comparison = comparisonKey ? t(`comparison.${comparisonKey}`) : undefined;

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40">
            {t("title")}
          </h1>
          <p className="text-sm text-text-secondary">
            {t("subtitle", { range: rangeLabel(period) })}
          </p>
        </div>
        <SegmentedControl
          ariaLabel={t("periodLabel")}
          value={period}
          onChange={setPeriod}
          options={PERIODS.map((p) => ({ value: p, label: t(`periods.${p}`) }))}
        />
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
            aria-label={t("keyNumbers")}
            className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
          >
            <StatCard
              label={t("kpi.cost")}
              icon={Coins}
              value={fmt.usd(stats.totalCost)}
              delta={comparison ? stats.costDelta : undefined}
              // "vs previous 7 days" only means something next to a percentage
              comparison={comparison && stats.costDelta !== null ? comparison : undefined}
            />
            <StatCard
              label={t("kpi.messages")}
              icon={MessagesSquare}
              value={fmt.number(stats.totalMessages)}
              delta={comparison ? stats.messagesDelta : undefined}
              comparison={t("kpi.inConversations", { count: stats.totalConversations })}
            />
            <StatCard
              label={t("kpi.tokens")}
              icon={Cpu}
              value={fmt.compact(stats.totalInputTokens + stats.totalOutputTokens)}
              delta={comparison ? stats.tokensDelta : undefined}
              comparison={t("kpi.tokensSplit", {
                input: fmt.compact(stats.totalInputTokens),
                output: fmt.compact(stats.totalOutputTokens),
              })}
            />
            <StatCard
              label={t("kpi.audio")}
              icon={AudioLines}
              value={fmt.duration(stats.totalAudioSeconds)}
              delta={comparison ? stats.audioDelta : undefined}
              comparison={t("kpi.audioNote")}
            />
          </section>

          {stats.totalMessages === 0 ? (
            <EmptyState
              title={t("empty.title")}
              description={t("empty.body")}
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
                    {t("top")}
                  </h2>
                  <Link
                    href="/dashboard/conversations"
                    className="inline-flex items-center gap-1.5 rounded-xs text-sm text-gold-light hover:text-text-primary"
                  >
                    {t("allConversations")} <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
                <DataTable
                  ariaLabel={t("top")}
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
