"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  BookOpen,
  Trash2,
  Play,
  FileText,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import Swal from "sweetalert2";
import { booksService } from "@/lib/api/services/books.service";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { BookSummary, BookStatus, CreateBookDto } from "@/types/books.types";
import { useToast } from "@/contexts/ToastContext";
import UploadModal from "@/components/Dashboard/Library/UploadModal";

const applyButtonStyles = (popup: HTMLElement, confirmColor: string) => {
  const confirm = popup.querySelector<HTMLElement>(".swal2-confirm");
  const cancel = popup.querySelector<HTMLElement>(".swal2-cancel");
  if (confirm) {
    confirm.style.cssText = `
      background-color: ${confirmColor} !important;
      color: ${confirmColor === "var(--z-error)" ? "#fff" : "#0d0d0d"} !important;
      font-weight: 600; border-radius: 0.75rem; padding: 0.5rem 1.25rem;
      font-size: 0.875rem; border: none; cursor: pointer;
    `;
  }
  if (cancel) {
    cancel.style.cssText = `
      background: transparent !important; color: var(--z-text-secondary) !important;
      border: 1.5px solid var(--z-border) !important; font-weight: 500;
      border-radius: 0.75rem; padding: 0.5rem 1rem; font-size: 0.875rem;
      cursor: pointer; transition: border-color 0.15s, color 0.15s;
    `;
    cancel.addEventListener("mouseenter", () => {
      cancel.style.borderColor = "var(--z-text-muted)";
      cancel.style.color = "var(--z-text-primary)";
    });
    cancel.addEventListener("mouseleave", () => {
      cancel.style.borderColor = "var(--z-border)";
      cancel.style.color = "var(--z-text-secondary)";
    });
  }
};

const swalBase = Swal.mixin({
  background: "var(--z-bg-elevated)",
  color: "var(--z-text-primary)",
  confirmButtonColor: "var(--z-gold)",
  cancelButtonColor: "#transparent",
  customClass: {
    popup: "!rounded-2xl !border !border-[var(--z-border)] !shadow-xl",
    title: "!text-[var(--z-text-primary)] !text-base !font-semibold",
    htmlContainer: "!text-[var(--z-text-muted)] !text-sm",
    actions: "!gap-3 !mt-1",
  },
});

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

function BookCard({
  book,
  onProcess,
  onDelete,
  onChat,
}: {
  book: BookSummary;
  onProcess: (id: string, retry?: boolean) => Promise<void>;
  onDelete: (id: string, title: string) => void;
  onChat: (id: string) => void;
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

        <div className="flex items-center gap-1">
          {book.status === "PENDING" && (
            <div className="relative group/tip">
              <button
                onClick={() => onProcess(book.id)}
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
              <span
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                style={{
                  backgroundColor: "var(--z-bg-overlay)",
                  color: "var(--z-text-primary)",
                  border: "1px solid var(--z-border)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                Process book
              </span>
            </div>
          )}
          {book.status === "FAILED" && (
            <div className="relative group/tip">
              <button
                onClick={() => onProcess(book.id, true)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: "var(--z-error)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(224,92,92,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <span
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                style={{
                  backgroundColor: "var(--z-bg-overlay)",
                  color: "var(--z-text-primary)",
                  border: "1px solid var(--z-border)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                Retry processing
              </span>
            </div>
          )}
          {book.status === "READY" && (
            <div className="relative group/tip">
              <button
                onClick={() => onChat(book.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                style={{ color: "var(--z-gold)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--z-gold-muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <span
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                style={{
                  backgroundColor: "var(--z-bg-overlay)",
                  color: "var(--z-text-primary)",
                  border: "1px solid var(--z-border)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                Chat
              </span>
            </div>
          )}
          <div className="relative group/tip">
            <button
              onClick={() => onDelete(book.id, book.title)}
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
            <span
              className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
              style={{
                backgroundColor: "var(--z-bg-overlay)",
                color: "var(--z-error)",
                border: "1px solid rgba(224,92,92,0.25)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Delete book
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default function UserLibraryPage() {
  const router = useRouter();
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

  const handleProcess = async (id: string, retry = false) => {
    const confirmColor = retry ? "var(--z-error)" : "var(--z-gold)";
    const { isConfirmed } = await swalBase.fire({
      title: retry ? "Retry processing?" : "Process this book?",
      html: retry
        ? "The previous attempt failed. Start a new processing run?"
        : "This will extract and index the book's content so you can chat with it.",
      icon: retry ? "warning" : "info",
      showCancelButton: true,
      confirmButtonText: retry ? "Retry" : "Process",
      cancelButtonText: "Cancel",
      didOpen: (popup) => applyButtonStyles(popup, confirmColor),
    });
    if (!isConfirmed) return;
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

  const handleChat = async (bookId: string) => {
    try {
      const conv = await conversationsService.create({ bookId });
      router.push(`/app/conversations/${conv.id}`);
    } catch (err: unknown) {
      notify(
        err instanceof Error ? err.message : "Failed to start chat",
        "error",
      );
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const { isConfirmed } = await swalBase.fire({
      title: "Delete this book?",
      html: `<span style="color:var(--z-text-primary);font-weight:600">"${title}"</span> and all its data will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      didOpen: (popup) => applyButtonStyles(popup, "var(--z-error)"),
    });
    if (!isConfirmed) return;
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
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
            {books.length} {books.length === 1 ? "book" : "books"}
          </p>
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
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
