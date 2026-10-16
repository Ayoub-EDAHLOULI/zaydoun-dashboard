"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { ArrowRight, BookOpen, MessageSquarePlus, Upload } from "lucide-react";
import { BookSpine, Skeleton, buttonClasses } from "@/components/ui";
import { NewConversationDialog } from "@/components/Conversations/NewConversationDialog";
import { booksService } from "@/lib/api/services/books.service";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { useAuth } from "@/contexts/AuthContext";
import { useLimits } from "@/contexts/LimitsContext";
import { useToast } from "@/contexts/ToastContext";
import { isArabic } from "@/lib/languages";
import { useRelativeTime } from "@/lib/time";
import { useConversationTitle } from "@/lib/conversations";
import { cn } from "@/lib/cn";
import type { BookSummary } from "@/types/books.types";
import type { ConversationSummary } from "@/types/conversations.types";

// Key in app.json → home.greeting
function greeting(): "late" | "morning" | "afternoon" | "evening" {
  const h = new Date().getHours();
  if (h < 5) return "late";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function excerpt(text: string, max = 140): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max).trimEnd()}…` : t;
}

const card = "rounded-md border border-border bg-bg-surface";

export default function HomeView() {
  const t = useTranslations("app.home");
  const format = useFormatter();
  const relativeTime = useRelativeTime();
  const conversationTitle = useConversationTitle();
  const { user } = useAuth();
  const { limits } = useLimits();
  const { notify } = useToast();

  const [books, setBooks] = useState<BookSummary[] | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [talkOpen, setTalkOpen] = useState(false);
  // Conversations active in the last 7 days (computed when the data arrives)
  const [thisWeek, setThisWeek] = useState(0);

  useEffect(() => {
    Promise.all([booksService.list(), conversationsService.list()])
      .then(([b, c]) => {
        setBooks(b);
        setConversations(
          [...c].sort((x, y) => y.updatedAt.localeCompare(x.updatedAt)),
        );
        const weekAgo = Date.now() - 7 * 86_400_000;
        setThisWeek(c.filter((x) => new Date(x.updatedAt).getTime() > weekAgo).length);
      })
      .catch((err: unknown) =>
        notify(err instanceof Error ? err.message : t("loadFailed"), "error"),
      );
  }, [notify, t]);

  const bookById = useMemo(
    () => new Map((books ?? []).map((b) => [b.id, b])),
    [books],
  );

  const firstName = user?.name?.trim().split(/\s+/)[0];
  const latest = conversations[0];
  const latestBook = latest ? bookById.get(latest.bookId) : undefined;
  const ready = (books ?? []).filter((b) => b.status === "READY");
  const reading = (books ?? []).filter((b) => b.status === "PROCESSING");
  const shelfFull = !!limits && !limits.unlimited && limits.books.used >= limits.books.limit;

  const subtitle = latestBook
    ? t("subtitleContinue", { name: latestBook.author || latestBook.title })
    : ready.length > 0
      ? t("subtitleReady")
      : t("subtitleEmpty");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-32 leading-[1.08] font-normal tracking-[-0.02em] md:text-48">
          {firstName
            ? t("greetingName", { greeting: t(`greeting.${greeting()}`), name: firstName })
            : t("greetingAlone", { greeting: t(`greeting.${greeting()}`) })}
        </h1>
        <p className="text-base text-text-secondary">{subtitle}</p>
      </header>

      {books === null ? (
        <HomeSkeleton />
      ) : (
        <>
          {/* Continue where you left off — or a first-run prompt */}
          {latest ? (
            <section
              aria-labelledby="continue-title"
              className="relative flex flex-wrap items-center gap-8 overflow-hidden rounded-lg border border-border-gold bg-bg-surface px-6 py-7 md:px-9 md:py-8"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 -end-20 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.16)_0%,rgba(201,168,76,0)_65%)]"
              />
              <div className="relative flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
                <span className="text-xs font-medium tracking-[0.12em] text-gold uppercase">
                  {t("continueEyebrow")}
                </span>
                <h2
                  id="continue-title"
                  dir="auto"
                  className="font-serif text-26 leading-[1.2] font-medium"
                >
                  {conversationTitle(latest, latestBook?.title)}
                </h2>
                <span className="text-sm text-text-secondary">
                  {[latestBook?.title, relativeTime(latest.updatedAt)].filter(Boolean).join(" · ")}
                </span>
                {latest.lastMessage && (
                  <p
                    dir="auto"
                    className={cn(
                      "mt-1 border-s-2 border-border-strong ps-4 text-text-primary",
                      isArabic(latest.languageCode, latest.lastMessage.content)
                        ? "font-arabic text-lg leading-relaxed"
                        : "font-serif text-lg leading-relaxed italic",
                    )}
                  >
                    “{excerpt(latest.lastMessage.content)}”
                  </p>
                )}
              </div>
              <Link
                href={`/app/conversations/${latest.id}`}
                className={buttonClasses({ size: "lg", className: "relative" })}
              >
                {t("continue")} <ArrowRight size={18} aria-hidden />
              </Link>
            </section>
          ) : (
            <section className="relative flex flex-wrap items-center gap-8 overflow-hidden rounded-lg border border-border-gold bg-bg-surface px-6 py-7 md:px-9 md:py-8">
              <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3">
                <span className="text-xs font-medium tracking-[0.12em] text-gold uppercase">
                  {ready.length > 0 ? t("first.eyebrowReady") : t("first.eyebrowEmpty")}
                </span>
                <h2 className="font-serif text-26 leading-[1.2] font-medium">
                  {ready.length > 0 ? t("first.titleReady") : t("first.titleEmpty")}
                </h2>
                <span className="text-sm text-text-secondary">
                  {ready.length > 0 ? t("first.bodyReady") : t("first.bodyEmpty")}
                </span>
              </div>
              {ready.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setTalkOpen(true)}
                  className={buttonClasses({ size: "lg" })}
                >
                  {t("newConversation")} <ArrowRight size={18} aria-hidden />
                </button>
              ) : (
                <Link href="/app/library#upload" className={buttonClasses({ size: "lg" })}>
                  <Upload size={18} aria-hidden /> {t("uploadBook")}
                </Link>
              )}
            </section>
          )}

          {/* Numbers */}
          <section
            aria-label={t("numbers")}
            className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4"
          >
            <Stat
              label={t("stats.books")}
              value={books.length}
              detail={
                [
                  ready.length && t("stats.ready", { count: ready.length }),
                  reading.length && t("stats.reading", { count: reading.length }),
                ]
                  .filter(Boolean)
                  .join(" · ") || t("stats.noneYet")
              }
            />
            <Stat
              label={t("stats.conversations")}
              value={conversations.length}
              detail={t("stats.thisWeek", { count: thisWeek })}
            />
            {limits &&
              (limits.unlimited ? (
                <Stat
                  label={t("stats.messagesLeft")}
                  value={t("stats.noLimit")}
                  detail={t("stats.adminAccount")}
                />
              ) : (
                <Stat
                  label={t("stats.messagesLeft")}
                  value={Math.max(0, limits.messages.limit - limits.messages.used)}
                  detail={t("stats.messagesDetail", {
                    limit: limits.messages.limit,
                    time: format.dateTime(new Date(limits.messages.resetsAt), {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }),
                  })}
                />
              ))}
          </section>

          <div className="flex flex-wrap items-start gap-6">
            {/* Recent conversations */}
            <section
              aria-labelledby="recent-title"
              className={cn(card, "min-w-0 flex-[2_1_520px] overflow-hidden")}
            >
              <div className="flex items-center justify-between px-5 py-[18px]">
                <h2 id="recent-title" className="text-base font-semibold">
                  {t("recent")}
                </h2>
                {conversations.length > 0 && (
                  <Link
                    href="/app/conversations"
                    className="rounded-xs text-sm text-gold-light hover:text-text-primary"
                  >
                    {t("seeAll")}
                  </Link>
                )}
              </div>
              {conversations.length === 0 ? (
                <p className="border-t border-border px-5 py-8 text-center text-sm text-text-secondary">
                  {t("noConversations")}
                </p>
              ) : (
                <ul>
                  {conversations.slice(0, 4).map((c) => {
                    const book = bookById.get(c.bookId);
                    const preview = c.lastMessage ? excerpt(c.lastMessage.content, 90) : "";
                    const arabicPreview = isArabic(c.languageCode, preview);
                    return (
                      <li key={c.id} className="border-t border-border">
                        <Link
                          href={`/app/conversations/${c.id}`}
                          className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-bg-elevated"
                        >
                          <BookSpine size="sm" />
                          <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span dir="auto" className="truncate text-15 font-medium">
                              {conversationTitle(c, book?.title)}
                            </span>
                            <span
                              dir="auto"
                              className={cn(
                                "truncate text-text-secondary",
                                arabicPreview ? "font-arabic text-15" : "text-13",
                              )}
                            >
                              {[book?.title, preview].filter(Boolean).join(" · ")}
                            </span>
                          </span>
                          <span className="text-13 whitespace-nowrap text-text-secondary">
                            {relativeTime(c.updatedAt)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Quick actions */}
            <section
              aria-labelledby="quick-title"
              className="flex min-w-0 flex-[1_1_280px] flex-col gap-3"
            >
              <h2 id="quick-title" className="mb-1 text-base font-semibold">
                {t("quick.title")}
              </h2>
              <QuickAction
                icon={MessageSquarePlus}
                title={t("newConversation")}
                detail={ready.length > 0 ? t("quick.newReady") : t("quick.newNone")}
                gold
                onClick={ready.length > 0 ? () => setTalkOpen(true) : undefined}
              />
              <QuickAction
                icon={Upload}
                title={t("uploadBook")}
                detail={shelfFull ? t("quick.uploadFull") : t("quick.uploadDetail")}
                href={shelfFull ? undefined : "/app/library#upload"}
              />
              <QuickAction
                icon={BookOpen}
                title={t("quick.library")}
                detail={
                  reading.length > 0
                    ? t("quick.stillReading", { title: reading[0].title })
                    : t("quick.booksOnShelf", { count: books.length })
                }
                href="/app/library"
              />
            </section>
          </div>
        </>
      )}

      <NewConversationDialog
        open={talkOpen}
        onClose={() => setTalkOpen(false)}
        books={books ?? []}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | string;
  detail: string;
}) {
  return (
    <div className={cn(card, "flex flex-col gap-2.5 p-5")}>
      <span className="text-13 font-medium text-text-secondary">{label}</span>
      <span className="text-32 leading-none font-medium tabular-nums">{value}</span>
      <span className="text-13 text-text-secondary">{detail}</span>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  detail,
  href,
  onClick,
  gold = false,
}: {
  icon: typeof Upload;
  title: string;
  detail: string;
  href?: string;
  onClick?: () => void;
  gold?: boolean;
}) {
  const enabled = !!href || !!onClick;
  const inner = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-[10px]",
          !enabled
            ? "bg-bg-surface text-text-muted"
            : gold
              ? "bg-gold-muted text-gold-light"
              : "bg-bg-elevated text-text-secondary",
        )}
      >
        <Icon size={20} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 text-start">
        <span className="text-15 font-medium">{title}</span>
        <span className="truncate text-13 text-text-secondary">{detail}</span>
      </span>
    </>
  );
  const base = "flex w-full items-center gap-3.5 rounded-md p-4";
  if (!enabled) {
    return (
      <div aria-disabled="true" className={cn(base, "border border-dashed border-border text-text-secondary")}>
        {inner}
      </div>
    );
  }
  const interactive = cn(base, card, "transition-colors hover:border-border-strong hover:bg-bg-elevated");
  return href ? (
    <Link href={href} className={interactive}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={interactive}>
      {inner}
    </button>
  );
}

function HomeSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy>
      <Skeleton className="h-[180px] rounded-lg" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[118px] rounded-md" />
        ))}
      </div>
      <Skeleton className="h-[240px] rounded-md" />
    </div>
  );
}
