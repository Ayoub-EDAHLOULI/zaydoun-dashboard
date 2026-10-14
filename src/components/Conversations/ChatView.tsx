"use client";

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings2, Trash2 } from "lucide-react";
import {
  ActionMenu,
  BookCover,
  Button,
  ChatMessage,
  Composer,
  ConfirmDialog,
  LimitBanner,
  Modal,
  Orb,
  PageTag,
  Select,
  Skeleton,
  ThinkingIndicator,
} from "@/components/ui";
import { booksService } from "@/lib/api/services/books.service";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { useToast } from "@/contexts/ToastContext";
import { useLimits } from "@/contexts/LimitsContext";
import { LANGUAGES, isArabic, languageName } from "@/lib/languages";
import { cn } from "@/lib/cn";
import type { BookDetail } from "@/types/books.types";
import type {
  ConversationDetail,
  ConversationSummary,
  MessageData,
} from "@/types/conversations.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
}

function conversationLabel(c: ConversationSummary): string {
  return c.title?.trim() || c.lastMessage?.content.slice(0, 60) || "New conversation";
}

function ReplyLanguageSelect({
  value,
  onChange,
  disabled,
  inline,
}: {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
  inline?: boolean;
}) {
  return (
    <Select
      label="Replies in"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      inline={inline}
      surface={inline}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.nativeName}
        </option>
      ))}
    </Select>
  );
}

// ---------------------------------------------------------------------------
// Side panel — the book, pages cited so far, other conversations
// ---------------------------------------------------------------------------

function BookPanel({
  book,
  citedPages,
  others,
  arabic,
}: {
  book: BookDetail | null;
  citedPages: number[];
  others: ConversationSummary[];
  arabic: boolean;
}) {
  const eyebrow = "text-xs font-medium tracking-[0.1em] text-text-secondary uppercase";
  return (
    <aside
      aria-label="About this book"
      className="hidden w-80 shrink-0 flex-col gap-7 overflow-y-auto border-l border-border-subtle bg-bg-base px-6 py-7 xl:flex"
    >
      {book ? (
        <div className="flex items-start gap-4">
          <BookCover title={book.title} author={book.author} language={book.language} size="xs" />
          <div className="flex min-w-0 flex-col gap-1">
            <span
              dir="auto"
              className={cn(
                "text-xl leading-[1.25] font-medium",
                isArabic(book.language, book.title) ? "font-arabic" : "font-serif",
              )}
            >
              {book.title}
            </span>
            {book.author && (
              <span dir="auto" className="text-sm text-text-secondary">
                {book.author}
              </span>
            )}
            <span className="text-[13px] text-text-secondary">
              {[languageName(book.language), book.totalPages > 0 && `${book.totalPages} pages`]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Skeleton className="h-[100px] w-[76px]" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <span className={eyebrow}>Pages cited here</span>
        {citedPages.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {citedPages.map((p) => (
              <PageTag key={p} page={p} arabic={arabic} />
            ))}
          </div>
        ) : (
          <span className="text-[13px] text-text-secondary">No pages cited yet.</span>
        )}
        <span className="text-[13px] leading-relaxed text-text-secondary">
          A running index of where this conversation has been in the book.
        </span>
      </div>

      {others.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <span className={eyebrow}>Other conversations</span>
          {others.map((c) => (
            <Link
              key={c.id}
              href={`/app/conversations/${c.id}`}
              className="flex flex-col gap-1 rounded-[10px] border border-border p-3 transition-colors hover:border-border-strong hover:bg-bg-surface"
            >
              <span dir="auto" className="truncate text-sm font-medium">
                {conversationLabel(c)}
              </span>
              <span className="text-xs text-text-secondary">
                {LANGUAGES.find((l) => l.code === c.languageCode)?.nativeName ?? c.languageCode} ·{" "}
                {shortDate(c.updatedAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </aside>
  );
}

// ---------------------------------------------------------------------------
// ChatView
// ---------------------------------------------------------------------------

export default function ChatView({ id }: { id: string }) {
  const router = useRouter();
  const { notify } = useToast();
  const { limits, refreshLimits } = useLimits();

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [book, setBook] = useState<BookDetail | null>(null);
  const [others, setOthers] = useState<ConversationSummary[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [savingLang, setSavingLang] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const logRef = useRef<HTMLDivElement>(null);
  const firstScroll = useRef(true);

  // ── Load the conversation, then its book and sibling conversations ─────
  useEffect(() => {
    conversationsService
      .get(id)
      .then((conv) => {
        setConversation(conv);
        setMessages(conv.messages);
        booksService.get(conv.bookId).then(setBook).catch(() => {});
        conversationsService
          .list(conv.bookId)
          .then((list) => setOthers(list.filter((c) => c.id !== conv.id)))
          .catch(() => {});
      })
      .catch((err: unknown) => {
        notify(err instanceof Error ? err.message : "Conversation not found", "error");
        router.replace("/app/conversations");
      });
  }, [id, notify, router]);

  // Keep the newest message in view (instant on first load)
  useLayoutEffect(() => {
    const el = logRef.current;
    if (!el || messages.length === 0) return;
    el.scrollTo({ top: el.scrollHeight, behavior: firstScroll.current ? "auto" : "smooth" });
    firstScroll.current = false;
  }, [messages, isSending]);

  const lang = conversation?.languageCode ?? "en";
  const arabic = lang === "ar";

  const citedPages = useMemo(
    () =>
      [...new Set(messages.map((m) => m.sourcePage).filter((p): p is number => !!p))].sort(
        (a, b) => a - b,
      ),
    [messages],
  );

  const outOfMessages =
    !!limits && !limits.unlimited && limits.messages.used >= limits.messages.limit;
  const quota =
    limits && !limits.unlimited
      ? `${Math.max(0, limits.messages.limit - limits.messages.used)} of ${limits.messages.limit} messages left today`
      : undefined;

  // ── Actions ─────────────────────────────────────────────────────────────
  const send = async () => {
    const text = draft.trim();
    if (!text || isSending || !conversation) return;

    const optimistic: MessageData = {
      id: `tmp-${Date.now()}`,
      conversationId: id,
      role: "user",
      content: text,
      sourcePage: null,
      audioPath: null,
      createdAt: new Date().toISOString(),
    };
    setDraft("");
    setIsSending(true);
    setMessages((prev) => [...prev, optimistic]);

    try {
      // The API returns only the AI reply — keep the optimistic user message
      const { aiMessage } = await conversationsService.chat(id, text, lang);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setDraft(text);
      notify(err instanceof Error ? err.message : "Couldn't send your message", "error");
    } finally {
      setIsSending(false);
      void refreshLimits();
    }
  };

  const changeLanguage = async (code: string) => {
    if (!conversation || code === conversation.languageCode) return;
    const previous = conversation.languageCode;
    setConversation({ ...conversation, languageCode: code });
    setSavingLang(true);
    try {
      await conversationsService.update(id, { languageCode: code });
    } catch (err) {
      setConversation((c) => (c ? { ...c, languageCode: previous } : c));
      notify(err instanceof Error ? err.message : "Couldn't change the language", "error");
    } finally {
      setSavingLang(false);
    }
  };

  const deleteConversation = async () => {
    try {
      await conversationsService.delete(id);
      notify("Conversation deleted", "success");
      router.replace("/app/conversations");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  const title = book?.title ?? "";
  const subtitle = [book?.author, conversation && `started ${shortDate(conversation.createdAt)}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex h-full min-h-0">
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-1 border-b border-border-subtle px-1 md:h-[72px] md:gap-3.5 md:px-6">
          <Link
            href="/app/conversations"
            aria-label="Back to conversations"
            className="flex size-11 shrink-0 items-center justify-center rounded-sm text-text-primary transition-colors hover:bg-bg-elevated md:size-10 md:text-text-secondary"
          >
            <ArrowLeft size={20} aria-hidden />
          </Link>
          {book && (
            <span className="hidden md:block">
              <MiniSpine arabic={isArabic(book.language, book.title)} />
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {book ? (
              <h1
                dir="auto"
                className={cn(
                  "truncate text-base font-semibold md:text-xl md:font-medium",
                  isArabic(book.language, book.title) ? "font-arabic" : "md:font-serif",
                )}
              >
                {title}
              </h1>
            ) : (
              <Skeleton className="h-5 w-48" />
            )}
            <span className="truncate text-xs text-text-secondary md:text-[13px]">
              <span className="md:hidden">Replies in {languageName(lang)}</span>
              <span className="hidden md:inline">{subtitle}</span>
            </span>
          </div>

          {/* Desktop: language + actions */}
          <div className="hidden items-center gap-2.5 md:flex">
            <ReplyLanguageSelect
              value={lang}
              onChange={changeLanguage}
              disabled={!conversation || savingLang}
              inline
            />
            <ActionMenu
              appearance="plain"
              ariaLabel="Conversation actions"
              items={[
                {
                  label: "Delete conversation",
                  icon: Trash2,
                  destructive: true,
                  onSelect: () => setDeleteOpen(true),
                },
              ]}
            />
          </div>

          {/* Mobile: settings sheet */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Conversation settings"
            className="flex size-11 shrink-0 items-center justify-center rounded-sm text-text-primary transition-colors hover:bg-bg-elevated md:hidden"
          >
            <Settings2 size={20} aria-hidden />
          </button>
        </header>

        {/* Messages */}
        <div
          ref={logRef}
          role="log"
          aria-label="Conversation"
          aria-live="polite"
          className="min-h-0 flex-1 overflow-y-auto px-4 pt-6 md:px-6 md:pt-8"
        >
          <div className="mx-auto flex max-w-[720px] flex-col gap-8 pb-8">
            {!conversation ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-11 w-2/3 self-end rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : messages.length === 0 && !isSending ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <Orb size={56} rings={1} muted className="mb-2" />
                <h2 className="font-serif text-[26px] leading-tight font-normal">
                  Ask Zaydoun about{" "}
                  <em dir="auto" className="text-gold-light italic">
                    {title || "this book"}
                  </em>
                </h2>
                <p className="max-w-[420px] text-sm leading-relaxed text-text-secondary">
                  Ask for an explanation, push back on an idea, or ask where something is in the
                  book. He&apos;ll answer in {languageName(lang)}.
                </p>
              </div>
            ) : (
              messages.map((m, i) => {
                const showDay =
                  i === 0 ||
                  new Date(m.createdAt).toDateString() !==
                    new Date(messages[i - 1].createdAt).toDateString();
                return (
                  <Fragment key={m.id}>
                    {showDay && (
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span className="h-px flex-1 bg-border-subtle" />
                        {dayLabel(m.createdAt)}
                        <span className="h-px flex-1 bg-border-subtle" />
                      </div>
                    )}
                    <ChatMessage
                      role={m.role}
                      content={m.content}
                      pages={m.sourcePage ? [m.sourcePage] : []}
                      languageCode={lang}
                    />
                  </Fragment>
                );
              })
            )}
            {isSending && <ThinkingIndicator />}
          </div>
        </div>

        {/* Composer, or the daily-limit notice */}
        <div className="shrink-0 px-3 pb-4 md:px-6 md:pb-6">
          <div className="mx-auto max-w-[720px]">
            {outOfMessages && limits ? (
              <LimitBanner variant="messages" limit={limits.messages.limit} />
            ) : (
              <Composer
                value={draft}
                onChange={setDraft}
                onSend={send}
                sending={isSending}
                disabled={!conversation}
                placeholder="Ask, push back, or ask for an example…"
                hint="Enter to send · Shift+Enter for a new line"
                quota={quota}
              />
            )}
          </div>
        </div>
      </section>

      <BookPanel book={book} citedPages={citedPages} others={others} arabic={arabic} />

      {/* Mobile settings sheet */}
      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Conversation settings"
        size="sm"
      >
        <ReplyLanguageSelect
          value={lang}
          onChange={changeLanguage}
          disabled={!conversation || savingLang}
        />
        <Button
          variant="destructive"
          onClick={() => {
            setSettingsOpen(false);
            setDeleteOpen(true);
          }}
        >
          <Trash2 size={18} aria-hidden />
          Delete conversation
        </Button>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteConversation}
        title="Delete this conversation?"
        description="Its messages will be removed for good. The book stays on your shelf."
        confirmLabel="Delete conversation"
        cancelLabel="Keep it"
      />
    </div>
  );
}

// Thin book spine next to the title, as in the mockup
function MiniSpine({ arabic }: { arabic: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block h-10 w-[30px] rounded-[2px_5px_5px_2px] border-l-[3px] border-gold-dark bg-bg-elevated",
        arabic && "bg-bg-overlay",
      )}
    />
  );
}
