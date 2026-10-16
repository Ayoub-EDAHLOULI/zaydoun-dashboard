"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button, Modal, StatusBadge } from "@/components/ui";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { useToast } from "@/contexts/ToastContext";
import {
  LANGUAGES,
  isArabic,
  languageDisplayName,
  type LanguageCode,
} from "@/lib/languages";
import { getReplyLanguagePref } from "@/lib/preferences";
import { cn } from "@/lib/cn";
import type { BookSummary } from "@/types/books.types";

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
  /** All of the user's books — only Ready ones can be picked */
  books: BookSummary[];
  /** Preselect a book (e.g. opened from a book card) */
  initialBookId?: string;
}

// Pick a Ready book and the reply language, then open the chat
export function NewConversationDialog({
  open,
  onClose,
  books,
  initialBookId,
}: NewConversationDialogProps) {
  const t = useTranslations("conversations.newDialog");
  const [busy, setBusy] = useState(false);
  // New key each time it opens, so the form starts fresh (and stays mounted
  // while the dialog animates out)
  const [wasOpen, setWasOpen] = useState(open);
  const [session, setSession] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setSession((s) => s + 1);
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("title")}
      description={t("description")}
      dismissible={!busy}
    >
      {session > 0 && (
        <DialogBody
          key={session}
          books={books}
          initialBookId={initialBookId}
          onCancel={onClose}
          onBusyChange={setBusy}
        />
      )}
    </Modal>
  );
}

function MiniCover({ book }: { book: BookSummary }) {
  const ready = book.status === "READY";
  const arabic = isArabic(book.language, book.title);
  return (
    <span
      aria-hidden
      dir={arabic ? "rtl" : undefined}
      className={cn(
        "h-12 w-9 shrink-0 overflow-hidden rounded-[5px] rounded-s-[2px] border-s-[3px] px-1 py-[5px] text-10 leading-[1.2]",
        ready ? "border-gold-dark bg-bg-elevated" : "border-border-strong bg-bg-surface",
        arabic ? "font-arabic font-bold text-gold-light" : "font-serif text-text-secondary",
      )}
    >
      {ready ? book.title.slice(0, 18) : null}
    </span>
  );
}

function DialogBody({
  books,
  initialBookId,
  onCancel,
  onBusyChange,
}: {
  books: BookSummary[];
  initialBookId?: string;
  onCancel: () => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const t = useTranslations("conversations.newDialog");
  const tb = useTranslations("common.book");
  const locale = useLocale();
  const router = useRouter();
  const { notify } = useToast();
  const ready = books.filter((b) => b.status === "READY");

  const [bookId, setBookId] = useState<string | undefined>(
    ready.find((b) => b.id === initialBookId)?.id ?? ready[0]?.id,
  );
  const [lang, setLang] = useState<LanguageCode>(() => getReplyLanguagePref(locale));
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (!bookId) return;
    setBusy(true);
    onBusyChange(true);
    try {
      const conv = await conversationsService.create({ bookId, languageCode: lang });
      router.push(`/app/conversations/${conv.id}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : t("failed"), "error");
      setBusy(false);
      onBusyChange(false);
    }
  };

  // Ready books first, then the ones still being read
  const ordered = [...ready, ...books.filter((b) => b.status !== "READY")];

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-13 font-medium text-text-secondary">
          {t("book")}
        </legend>
        {ordered.length === 0 && (
          <p className="text-sm text-text-secondary">{t("emptyShelf")}</p>
        )}
        {ordered.map((book) => {
          const selectable = book.status === "READY";
          const selected = book.id === bookId;
          const meta = selectable
            ? [
                book.author,
                languageDisplayName(book.language, locale),
                book.totalPages > 0 && tb("pages", { count: book.totalPages }),
              ]
                .filter(Boolean)
                .join(" · ")
            : book.status === "FAILED"
              ? t("failedBook")
              : t("stillReading");
          return (
            <label
              key={book.id}
              className={cn(
                "flex items-center gap-3.5 rounded-md border p-3.5 transition-colors",
                selectable
                  ? selected
                    ? "cursor-pointer border-gold bg-gold/12"
                    : "cursor-pointer border-border bg-bg-elevated hover:border-border-strong"
                  : "cursor-not-allowed border-border bg-bg-elevated opacity-60",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
              )}
            >
              <input
                type="radio"
                name="nc-book"
                value={book.id}
                checked={selected}
                disabled={!selectable || busy}
                onChange={() => setBookId(book.id)}
                className="size-[18px] shrink-0 accent-gold focus-visible:outline-none"
              />
              <MiniCover book={book} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span
                  dir="auto"
                  className={cn(
                    "truncate text-17 leading-[1.2] font-medium",
                    isArabic(book.language, book.title) ? "font-arabic" : "font-serif",
                  )}
                >
                  {book.title}
                </span>
                <span className="truncate text-13 text-text-secondary">{meta}</span>
              </span>
              <StatusBadge status={book.status} className="hidden sm:inline-flex" />
            </label>
          );
        })}
      </fieldset>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="mb-2.5 text-13 font-medium text-text-secondary">
          {t("repliesIn")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <label
                key={l.code}
                lang={l.code}
                className={cn(
                  "relative inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 transition-colors",
                  selected
                    ? "border-gold bg-gold-muted font-medium text-gold-light"
                    : "border-border-strong text-text-primary hover:bg-bg-elevated",
                  l.code === "ar" ? "font-arabic text-17" : "text-sm",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold",
                )}
              >
                <input
                  type="radio"
                  name="nc-lang"
                  value={l.code}
                  checked={selected}
                  disabled={busy}
                  onChange={() => setLang(l.code)}
                  className="sr-only"
                />
                {selected && <Check size={16} aria-hidden />}
                {l.nativeName}
              </label>
            );
          })}
        </div>
        <span className="text-13 text-text-secondary">
          {t("languageHint")}
        </span>
      </fieldset>

      <div className="flex flex-col-reverse gap-2.5 md:flex-row md:justify-end">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          {t("cancel")}
        </Button>
        <Button onClick={start} loading={busy} disabled={!bookId}>
          {t("start")}
        </Button>
      </div>
    </div>
  );
}
