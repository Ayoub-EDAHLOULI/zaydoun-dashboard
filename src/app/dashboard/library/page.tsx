"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Upload,
  BookOpen,
  Trash2,
  Play,
  FileText,
  RefreshCw,
} from "lucide-react";
import { booksService } from "@/lib/api/services/books.service";
import { BookSummary, BookStatus, CreateBookDto } from "@/types/books.types";
import { useToast } from "@/contexts/ToastContext";
import UploadModal from "@/components/Dashboard/Library/UploadModal";

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BookStatus,
  { label: string; bg: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    bg: "var(--z-gold-muted)",
    color: "var(--z-gold)",
  },
  PROCESSING: {
    label: "Processing",
    bg: "rgba(91,155,213,0.12)",
    color: "var(--z-info)",
  },
  READY: {
    label: "Ready",
    bg: "rgba(76,175,125,0.12)",
    color: "var(--z-success)",
  },
  FAILED: {
    label: "Failed",
    bg: "rgba(224,92,92,0.12)",
    color: "var(--z-error)",
  },
};

function StatusBadge({ status }: { status: BookStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  );
}

// ── Language badge ────────────────────────────────────────────────────────────

function LangBadge({ lang }: { lang: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium uppercase"
      style={{
        backgroundColor: "var(--z-bg-overlay)",
        color: "var(--z-text-muted)",
      }}
    >
      {lang}
    </span>
  );
}

// ── Book card ─────────────────────────────────────────────────────────────────

function BookCard({
  book,
  onProcess,
  onDelete,
}: {
  book: BookSummary;
  onProcess: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-150"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: "1px solid var(--z-border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--z-border-gold)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--z-border)")
      }
    >
      {/* Icon + status */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--z-gold-muted)",
            border: "1px solid var(--z-border-gold)",
          }}
        >
          <BookOpen className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
        </div>
        <StatusBadge status={book.status} />
      </div>

      {/* Title + author */}
      <div className="flex-1">
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: "var(--z-text-primary)" }}
        >
          {book.title}
        </h3>
        {book.author && (
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: "var(--z-text-muted)" }}
          >
            {book.author}
          </p>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LangBadge lang={book.language} />
          {book.totalPages > 0 && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--z-text-muted)" }}
            >
              <FileText className="w-3 h-3" />
              {book.totalPages}p
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {book.status === "PENDING" && (
            <button
              onClick={() => onProcess(book.id)}
              title="Process book"
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--z-info)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(91,155,213,0.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          {book.status === "FAILED" && (
            <button
              onClick={() => onProcess(book.id)}
              title="Retry processing"
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--z-error)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(224,92,92,0.12)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(book.id, book.title)}
            title="Delete book"
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--z-text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--z-error)";
              e.currentTarget.style.backgroundColor = "rgba(224,92,92,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--z-text-muted)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div
      className="rounded-xl p-12 flex flex-col items-center gap-4 text-center"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: "1px dashed var(--z-border)",
      }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: "var(--z-gold-muted)",
          border: "1px solid var(--z-border-gold)",
        }}
      >
        <BookOpen className="w-6 h-6" style={{ color: "var(--z-gold)" }} />
      </div>
      <div>
        <p
          className="text-base font-semibold"
          style={{ color: "var(--z-text-primary)" }}
        >
          Your library is empty
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--z-text-muted)" }}>
          Upload a PDF to start reading and asking questions.
        </p>
      </div>
      <button
        onClick={onUpload}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        style={{ backgroundColor: "var(--z-gold)", color: "#0d0d0d" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--z-gold-light)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--z-gold)")
        }
      >
        <Upload className="w-4 h-4" />
        Upload your first book
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const { notify } = useToast();
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await booksService.list();
      setBooks(data);
    } catch (err: unknown) {
      notify(
        err instanceof Error ? err.message : "Failed to load books",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    const run = async () => {
      await load();
    };
    void run();
  }, [load]);

  const handleUpload = async (file: File, data: CreateBookDto) => {
    try {
      const book = await booksService.upload(file, data);
      setBooks((prev) => [book, ...prev]);
      notify("Book uploaded successfully", "success");
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Upload failed", "error");
      throw err;
    }
  };

  const handleProcess = async (id: string) => {
    try {
      await booksService.process(id);
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "PROCESSING" } : b)),
      );
      notify("Processing started", "success");
    } catch (err: unknown) {
      notify(
        err instanceof Error ? err.message : "Failed to start processing",
        "error",
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await booksService.delete(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      notify("Book deleted", "success");
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  if (isLoading) {
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

  return (
    <>
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
              {books.length} {books.length === 1 ? "book" : "books"}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: "var(--z-gold)",
              color: "#0d0d0d",
              boxShadow: "var(--z-shadow-gold)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--z-gold-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--z-gold)")
            }
          >
            <Upload className="w-4 h-4" />
            Upload book
          </button>
        </div>

        {books.length === 0 ? (
          <EmptyState onUpload={() => setIsModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onProcess={handleProcess}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
