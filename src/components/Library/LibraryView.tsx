"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import type { BookSummary, CreateBookDto } from "@/types/books.types";
import type { ConversationSummary } from "@/types/conversations.types";

type Filter = "all" | "ready" | "progress";

// How often to re-check books that are being processed
const POLL_MS = 5000;

function lastOpenedLabel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "last opened today";
  if (days === 1) return "last opened yesterday";
  if (days < 7) return `last opened ${days} days ago`;
  return `last opened ${new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function LibraryView() {
  const { notify } = useToast();
  const { limits, refreshLimits } = useLimits();

  const [books, setBooks] = useState<BookSummary[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [talkBookId, setTalkBookId] = useState<string | null>(null);
  // Kept after closing so the dialog keeps its text while it animates out
  const [toDelete, setToDelete] = useState<BookSummary | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // ── Load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([booksService.list(), conversationsService.list().catch(() => [])])
      .then(([b, c]) => {
        setBooks(b);
        setConversations(c);
      })
      .catch((err: unknown) =>
        notify(err instanceof Error ? err.message : "Couldn't load your books", "error"),
      )
      .finally(() => setIsLoading(false));
  }, [notify]);

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
          if (after?.status === "READY") notify(`“${after.title}” is ready to talk.`, "success");
          if (after?.status === "FAILED") notify(`Zaydoun couldn't read “${after.title}”.`, "error");
        }
        setBooks(fresh);
      } catch {
        // Try again on the next tick
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [hasProcessing, notify]);

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
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (filter === "ready" && b.status !== "READY") return false;
      if (filter === "progress" && b.status === "READY") return false;
      if (!q) return true;
      return b.title.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
    });
  }, [books, query, filter]);

  const readyCount = books.filter((b) => b.status === "READY").length;
  const readingCount = books.filter((b) => b.status === "PROCESSING").length;
  const summary = [
    `${books.length} ${books.length === 1 ? "book" : "books"}`,
    readyCount > 0 && `${readyCount} ready to talk`,
    readingCount > 0 && `${readingCount} being read`,
  ]
    .filter(Boolean)
    .join(" · ");

  // ── Actions ─────────────────────────────────────────────────────────────
  const upload = async (file: File, data: CreateBookDto) => {
    try {
      const book = await booksService.upload(file, data);
      setBooks((prev) => [book, ...prev]);
      notify(`“${book.title}” is on your shelf. Let Zaydoun read it when you're ready.`, "success");
      void refreshLimits();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Upload failed", "error");
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
        notify(`Zaydoun is reading “${book.title}”. We'll let you know.`, "info");
      } catch (err) {
        notify(err instanceof Error ? err.message : "Couldn't start reading", "error");
      } finally {
        setProcessingIds((s) => {
          const next = new Set(s);
          next.delete(book.id);
          return next;
        });
      }
    },
    [notify],
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await booksService.delete(toDelete.id);
      setBooks((prev) => prev.filter((b) => b.id !== toDelete.id));
      setConversations((prev) => prev.filter((c) => c.bookId !== toDelete.id));
      notify(`“${toDelete.title}” was removed.`, "success");
      setDeleteOpen(false);
      void refreshLimits();
    } catch (err) {
      notify(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  const cardProps = (book: BookSummary): { primaryAction: BookCardAction; detail?: string } => {
    const stats = convStats.get(book.id);
    switch (book.status) {
      case "READY":
        return {
          primaryAction: {
            label: "Talk to this book",
            icon: MessageSquare,
            onClick: () => {
              setTalkBookId(book.id);
              setTalkOpen(true);
            },
          },
          detail: stats
            ? `${stats.count} ${stats.count === 1 ? "conversation" : "conversations"} · ${lastOpenedLabel(stats.last)}`
            : "No conversations yet",
        };
      case "PROCESSING":
        return {
          primaryAction: { label: "Talk to this book", icon: MessageSquare, disabled: true },
          detail: "Zaydoun is reading it. We'll let you know.",
        };
      case "PENDING":
        return {
          primaryAction: {
            label: "Let Zaydoun read it",
            icon: Play,
            onClick: () => process(book),
            loading: processingIds.has(book.id),
          },
          detail: "Uploaded. Zaydoun hasn't read it yet.",
        };
      case "FAILED":
        return {
          primaryAction: {
            label: "Try again",
            icon: RotateCw,
            onClick: () => process(book),
            loading: processingIds.has(book.id),
          },
          detail: "Zaydoun couldn't read this PDF.",
        };
    }
  };

  const deleteDescription = (book: BookSummary) => {
    const count = convStats.get(book.id)?.count ?? 0;
    const convs =
      count > 0
        ? `This removes the book and its ${count} ${count === 1 ? "conversation" : "conversations"}.`
        : "This removes the book from your shelf.";
    const slot =
      limits && !limits.unlimited ? " It frees one of your free slots." : "";
    return `${convs}${slot} This can't be undone.`;
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-[32px] leading-[1.1] font-normal tracking-[-0.02em] md:text-[40px]">
            Library
          </h1>
          {!isLoading && <p className="text-sm text-text-secondary">{summary}</p>}
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          disabled={shelfFull || isLoading}
          aria-describedby={shelfFull ? "shelf-full" : undefined}
        >
          <Upload size={18} aria-hidden />
          Upload book
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
          title="Your shelf is empty"
          description="Upload a PDF and Zaydoun will read it, page by page, before your first question."
          action={
            <Button onClick={() => setUploadOpen(true)} disabled={shelfFull}>
              <Upload size={18} aria-hidden />
              Upload a book
            </Button>
          }
          className="py-16"
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              label="Search your books"
              hideLabel
              icon={Search}
              type="search"
              placeholder="Search title or author"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              wrapperClassName="flex-[1_1_280px] max-w-[420px]"
              surface
            />
            <SegmentedControl
              ariaLabel="Filter by status"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "ready", label: "Ready" },
                { value: "progress", label: "In progress" },
              ]}
            />
          </div>

          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-secondary">
              No books match {query.trim() ? `“${query.trim()}”` : "this filter"}.
            </p>
          ) : (
            <section
              aria-label="Books"
              className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6"
            >
              {visible.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  {...cardProps(book)}
                  menuItems={[
                    {
                      label: "Delete book",
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
                  <span className="text-[15px] font-medium text-text-secondary">No free slot</span>
                  <span className="max-w-[220px] text-[13px] leading-relaxed text-text-secondary">
                    Your free books are all on the shelf. Delete one from its ··· menu to upload
                    another.
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
        note={lastSlot ? "This uses your last free slot." : undefined}
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
        title={toDelete ? `Delete “${toDelete.title}”?` : ""}
        description={toDelete ? deleteDescription(toDelete) : undefined}
        confirmLabel="Delete book"
        cancelLabel="Keep it"
      />
    </div>
  );
}
