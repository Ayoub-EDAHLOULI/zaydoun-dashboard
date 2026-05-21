"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Trash2, BookOpen, Clock } from "lucide-react";
import Swal from "sweetalert2";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { ConversationSummary } from "@/types/conversations.types";
import { useToast } from "@/contexts/ToastContext";

// ── Swal button styler ────────────────────────────────────────────────────────

const applyButtonStyles = (popup: HTMLElement, confirmColor: string) => {
  const confirm = popup.querySelector<HTMLElement>(".swal2-confirm");
  const cancel = popup.querySelector<HTMLElement>(".swal2-cancel");

  if (confirm) {
    confirm.style.cssText = `
      background-color: ${confirmColor} !important;
      color: #fff !important;
      font-weight: 600;
      border-radius: 0.75rem;
      padding: 0.5rem 1.25rem;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
    `;
  }

  if (cancel) {
    cancel.style.cssText = `
      background: transparent !important;
      color: var(--z-text-secondary) !important;
      border: 1.5px solid var(--z-border) !important;
      font-weight: 500;
      border-radius: 0.75rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
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
  customClass: {
    popup: "!rounded-2xl !border !border-[var(--z-border)] !shadow-xl",
    title: "!text-[var(--z-text-primary)] !text-base !font-semibold",
    htmlContainer: "!text-[var(--z-text-muted)] !text-sm",
    actions: "!gap-3 !mt-1",
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ── Conversation row ──────────────────────────────────────────────────────────

function ConversationRow({
  conv,
  onDelete,
}: {
  conv: ConversationSummary;
  onDelete: (id: string, title: string) => void;
}) {
  const displayTitle = conv.title ?? "Untitled conversation";
  const preview = conv.lastMessage?.content ?? "No messages yet";
  const isUser = conv.lastMessage?.role === "user";

  return (
    <div
      className="flex items-start gap-4 px-5 py-4 rounded-xl transition-all duration-150 cursor-pointer group"
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
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{
          backgroundColor: "var(--z-gold-muted)",
          border: "1px solid var(--z-border-gold)",
        }}
      >
        <MessageSquare className="w-4 h-4" style={{ color: "var(--z-gold)" }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "var(--z-text-primary)" }}
          >
            {displayTitle}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: "var(--z-text-muted)" }}
            >
              <Clock className="w-3 h-3" />
              {timeAgo(conv.updatedAt)}
            </span>

            <div className="relative group/tip">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conv.id, displayTitle);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-all opacity-0 group-hover:opacity-100"
                style={{ color: "var(--z-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--z-error)";
                  e.currentTarget.style.backgroundColor =
                    "rgba(224,92,92,0.08)";
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
                Delete
              </span>
            </div>
          </div>
        </div>

        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: "var(--z-text-muted)" }}
        >
          <span style={{ color: "var(--z-text-secondary)" }}>
            {isUser ? "You" : "Zaydoun"}:
          </span>{" "}
          {preview}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span
            className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-md"
            style={{
              backgroundColor: "var(--z-bg-overlay)",
              color: "var(--z-text-muted)",
            }}
          >
            <BookOpen className="w-3 h-3" />
            {conv.bookId.slice(0, 8)}…
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-md uppercase font-medium"
            style={{
              backgroundColor: "var(--z-bg-overlay)",
              color: "var(--z-text-muted)",
            }}
          >
            {conv.languageCode}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
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
        <MessageSquare className="w-6 h-6" style={{ color: "var(--z-gold)" }} />
      </div>
      <div>
        <p
          className="text-base font-semibold"
          style={{ color: "var(--z-text-primary)" }}
        >
          No conversations yet
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--z-text-muted)" }}>
          Open a book from your library and start chatting with Zaydoun.
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ConversationsPage() {
  const { notify } = useToast();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await conversationsService.list();
      setConversations(data);
    } catch (err: unknown) {
      notify(
        err instanceof Error ? err.message : "Failed to load conversations",
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

  const handleDelete = async (id: string, title: string) => {
    const { isConfirmed } = await swalBase.fire({
      title: "Delete this conversation?",
      html: `<span style="color:var(--z-text-primary);font-weight:600">"${title}"</span> and all its messages will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      didOpen: (popup) => applyButtonStyles(popup, "var(--z-error)"),
    });
    if (!isConfirmed) return;
    try {
      await conversationsService.delete(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      notify("Conversation deleted", "success");
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
    <div className="space-y-6">
      <div>
        <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
          {conversations.length}{" "}
          {conversations.length === 1 ? "conversation" : "conversations"}
        </p>
      </div>

      {conversations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((conv) => (
            <ConversationRow
              key={conv.id}
              conv={conv}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
