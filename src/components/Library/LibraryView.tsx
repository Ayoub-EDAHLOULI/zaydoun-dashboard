"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare, Play, Plus, RotateCw, Search, Trash2, Upload } from "lucide-react";
import {
  BookCard,
  BookCardSkeleton,
  Button,
  ConfirmDialog,
  EmptyState,
  Input,
  LimitBanner,
  SegmentedControl,
  type BookCardAction,
} from "@/components/ui";
import { NewConversationDialog } from "@/components/Conversations/NewConversationDialog";
import { UploadBookModal } from "./UploadBookModal";
import { booksService } from "@/lib/api/services/books.service";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { useToast } from "@/contexts/ToastContext";
import { useLimits } from "@/contexts/LimitsContext";
import { useFormatDate } from "@/lib/time";
import type { BookSummary, CreateBookDto } from "@/types/books.types";
import type { ConversationSummary } from "@/types/conversations.types";

type Filter = "all" | "ready" | "progress";

// How often to re-check books that are being processed
const POLL_MS = 5000;

const daysSince = (iso: string) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);

export default function LibraryView() {
  const t = useTranslations("library");
  const formatDate = useFormatDate();
  const { notify } = useToast();

  const lastOpenedLabel = (iso: string): string => {
    const days = daysSince(iso);
    if (days <= 0) return t("lastOpened.today");
    if (days === 1) return t("lastOpened.yesterday");
    if (days < 7) return t("lastOpened.daysAgo", { count: days });
    return t("lastOpened.on", {
      date: formatDate(iso, { month: "short", day: "numeric" }),
    });
  };
  const { limits, refreshLimits } = useLimits();

  const [books, setBooks] = useState<BookSummary[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  // Opened straight away when arriving from Home's "Upload a book" (#upload).
  // Safe to read location here: the shell only renders pages client-side.
  const [uploadOpen, setUploadOpen] = useState(
    () => typeof window !== "undefined" && window.location.hash === "#upload",
  );
  const [talkBookId, setTalkBookId] = useState<string | null>(null);
  // Kept after closing so the dialog keeps its text while it animates out
  const [toDelete, setToDelete] = useState<BookSummary | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Drop the #upload hash so a refresh doesn't reopen the dialog
  useEffect(() => {
    if (window.location.hash === "#upload") {
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  // ── Load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([booksService.list(), conversationsService.list().catch(() => [])])
      .then(([b, c]) => {
        setBooks(b);
        setConversations(c);
      })
      .catch((err: unknown) =>
        notify(err instanceof Error ? err.message : t("toast.loadFailed"), "error"),
      )
      .finally(() => setIsLoading(false));
  }, [notify, t]);

  // ── Poll while Zaydoun is reading, and announce when he's done ──────────
  const booksRef = useRef(books);
  useEffect(() => {
    booksRef.current = books;
  }, [books]);
  const hasProcessing = books.some((b) => b.status === "PROCESSING");

  useEffect(() => {
    if (!hasProcessing) return;
    const timer = setInterval(async () => {
      try {
        const fresh = await booksService.list();
        for (const before of booksRef.current) {
          if (before.status !== "PROCESSING") continue;
          const after = fresh.find((b) => b.id === before.id);
          if (after?.status === "READY")
            notify(t("toast.ready", { title: after.title }), "success");
          if (after?.status === "FAILED")
            notify(t("toast.failed", { title: after.title }), "error");
        }
        setBooks(fresh);
      } catch {
        // Try again on the next tick
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [hasProcessing, notify, t]);

  // ── Derived ─────────────────────────────────────────────────────────────
  const shelfFull =
    !!limits && !limits.unlimited && limits.books.used >= limits.books.limit;
  const lastSlot =
    !!limits && !limits.unlimited && limits.books.used === limits.books.limit - 1;

  const convStats = useMemo(() => {
    const map = new Map<string, { count: number; last: string }>();
    for (const c of conversations) {
      const prev = map.get(c.bookId);
      map.set(c.bookId, {
        count: (prev?.count ?? 0) + 1,
        last: !prev || c.updatedAt > prev.last ? c.updatedAt : prev.last,
      });
    }
    return map;
  }, [conversations]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return books.filter((b) => {
      if (filter === "ready" && b.status !== "READY") return false;
      if (filter === "progress" && b.status === "READY") return false;
      if (!q) return true;
      return (
        b.title.toLocaleLowerCase().includes(q) ||
        b.author?.toLocaleLowerCase().includes(q)
      );
    });
  }, [books, query, filter]);

  const readyCount = books.filter((b) => b.status === "READY").length;
  const readingCount = books.filter((b) => b.status === "PROCESSING").length;
  const summary = [
    t("summary.books", { count: books.length }),
    readyCount > 0 && t("summary.ready", { count: readyCount }),
    readingCount > 0 && t("summary.reading", { count: readingCount }),
  ]
    .filter(Boolean)
    .join(" · ");

  // ── Actions ─────────────────────────────────────────────────────────────
  const upload = async (file: File, data: CreateBookDto) => {
    try {
      const book = await booksService.upload(file, data);
      setBooks((prev) => [book, ...prev]);
      notify(t("toast.uploaded", { title: book.title }), "success");
      void refreshLimits();
    } catch (err) {
      notify(err instanceof Error ? err.message : t("toast.uploadFailed"), "error");
      throw err;
    }
  };

  const process = useCallback(
    async (book: BookSummary) => {
      setProcessingIds((s) => new Set(s).add(book.id));
      try {
        await booksService.process(book.id);
        setBooks((prev) =>
          prev.map((b) => (b.id === book.id ? { ...b, status: "PROCESSING" } : b)),
        );
        notify(t("toast.reading", { title: book.title }), "info");
      } catch (err) {
        notify(err instanceof Error ? err.message : t("toast.processFailed"), "error");
      } finally {
        setProcessingIds((s) => {
          const next = new Set(s);
          next.delete(book.id);
          return next;
        });
      }
    },
    [notify, t],
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await booksService.delete(toDelete.id);
      setBooks((prev) => prev.filter((b) => b.id !== toDelete.id));
      setConversations((prev) => prev.filter((c) => c.bookId !== toDelete.id));
      notify(t("toast.deleted", { title: toDelete.title }), "success");
      setDeleteOpen(false);
      void refreshLimits();
    } catch (err) {
      notify(err instanceof Error ? err.message : t("toast.deleteFailed"), "error");
    }
  };

  const cardProps = (book: BookSummary): { primaryAction: BookCardAction; detail?: string } => {
    const stats = convStats.get(book.id);
    switch (book.status) {
      case "READY":
        return {
          primaryAction: {
            label: t("card.talk"),
            icon: MessageSquare,
            onClick: () => {
              setTalkBookId(book.id);
              setTalkOpen(true);
            },
          },
          detail: stats
            ? `${t("card.conversations", { count: stats.count })} · ${lastOpenedLabel(stats.last)}`
            : t("card.noConversations"),
        };
      case "PROCESSING":
        return {
          primaryAction: { label: t("card.talk"), icon: MessageSquare, disabled: true },
          detail: t("card.processing"),
        };
      case "PENDING":
        return {
          primaryAction: {
            label: t("card.read"),
            icon: Play,
            onClick: () => process(book),
            loading: processingIds.has(book.id),
          },
          detail: t("card.pending"),
        };
      case "FAILED":
        return {
          primaryAction: {
            label: t("card.retry"),
            icon: RotateCw,
            onClick: () => process(book),
            loading: processingIds.has(book.id),
          },
          detail: t("card.failed"),
        };
    }
  };

  const deleteDescription = (book: BookSummary) => {
    const count = convStats.get(book.id)?.count ?? 0;
    const parts = [
      count > 0 ? t("delete.withConversations", { count }) : t("delete.bookOnly"),
      limits && !limits.unlimited ? t("delete.freesSlot") : null,
      t("delete.permanent"),
    ];
    return parts.filter(Boolean).join(" ");
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40">
            {t("title")}
          </h1>
          {!isLoading && <p className="text-sm text-text-secondary">{summary}</p>}
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          disabled={shelfFull || isLoading}
          aria-describedby={shelfFull ? "shelf-full" : undefined}
        >
          <Upload size={18} aria-hidden />
          {t("uploadButton")}
        </Button>
      </header>

      {shelfFull && limits && (
        <div id="shelf-full">
          <LimitBanner variant="books" limit={limits.books.limit} />
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6" aria-busy>
          <BookCardSkeleton />
          <BookCardSkeleton />
          <BookCardSkeleton />
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.body")}
          action={
            <Button onClick={() => setUploadOpen(true)} disabled={shelfFull}>
              <Upload size={18} aria-hidden />
              {t("empty.action")}
            </Button>
          }
          className="py-16"
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              label={t("search.label")}
              hideLabel
              icon={Search}
              type="search"
              placeholder={t("search.placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              wrapperClassName="flex-[1_1_280px] max-w-[420px]"
              surface
            />
            <SegmentedControl
              ariaLabel={t("filter.label")}
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: t("filter.all") },
                { value: "ready", label: t("filter.ready") },
                { value: "progress", label: t("filter.progress") },
              ]}
            />
          </div>

          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-secondary">
              {query.trim()
                ? t("noMatchQuery", { query: query.trim() })
                : t("noMatchFilter")}
            </p>
          ) : (
            <section
              aria-label={t("booksLabel")}
              className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6"
            >
              {visible.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  {...cardProps(book)}
                  menuItems={[
                    {
                      label: t("delete.action"),
                      icon: Trash2,
                      destructive: true,
                      onSelect: () => {
                        setToDelete(book);
                        setDeleteOpen(true);
                      },
                    },
                  ]}
                />
              ))}

              {shelfFull && filter === "all" && !query && (
                <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-md border-[1.5px] border-dashed border-border px-6 py-8 text-center">
                  <span className="flex size-11 items-center justify-center rounded-md bg-bg-surface text-text-muted">
                    <Plus size={20} aria-hidden />
                  </span>
                  <span className="text-15 font-medium text-text-secondary">
                    {t("noSlot.title")}
                  </span>
                  <span className="max-w-[220px] text-13 leading-relaxed text-text-secondary">
                    {t("noSlot.body")}
                  </span>
                </div>
              )}
            </section>
          )}
        </>
      )}

      <UploadBookModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={upload}
        note={lastSlot ? t("lastSlot") : undefined}
      />

      <NewConversationDialog
        open={talkOpen}
        onClose={() => setTalkOpen(false)}
        books={books}
        initialBookId={talkBookId ?? undefined}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={toDelete ? t("delete.title", { title: toDelete.title }) : ""}
        description={toDelete ? deleteDescription(toDelete) : undefined}
        confirmLabel={t("delete.action")}
        cancelLabel={t("delete.keep")}
      />
    </div>
  );
}
