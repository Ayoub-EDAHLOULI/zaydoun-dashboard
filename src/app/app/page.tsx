"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  MessageSquare,
  Upload,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { booksService } from "@/lib/api/services/books.service";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { BookSummary } from "@/types/books.types";
import { ConversationSummary } from "@/types/conversations.types";

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

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  gold,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
  gold?: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl p-5 flex items-center justify-between group transition-all"
      style={{
        backgroundColor: "var(--z-bg-surface)",
        border: `1px solid ${gold ? "var(--z-border-gold)" : "var(--z-border)"}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "var(--z-border-gold)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = gold
          ? "var(--z-border-gold)"
          : "var(--z-border)";
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--z-gold-muted)",
            border: "1px solid var(--z-border-gold)",
          }}
        >
          <Icon className="w-5 h-5" style={{ color: "var(--z-gold)" }} />
        </div>
        <div>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--z-text-primary)" }}
          >
            {value}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--z-text-muted)" }}
          >
            {label}
          </p>
        </div>
      </div>
      <ChevronRight
        className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--z-gold)" }}
      />
    </Link>
  );
}

export default function AppOverviewPage() {
  const { user } = useAuth();
  const { notify } = useToast();

  const [books, setBooks] = useState<BookSummary[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [b, c] = await Promise.all([
        booksService.list(),
        conversationsService.list(),
      ]);
      setBooks(b);
      setConversations(c);
    } catch {
      notify("Failed to load data", "error");
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

  const firstName = user?.name?.split(" ")[0] ?? user?.email ?? "there";
  const readyBooks = books.filter((b) => b.status === "READY");
  const recentConversations = conversations.slice(0, 4);

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
    <div className="space-y-8 max-w-3xl">
      {/* Greeting */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--z-text-primary)" }}
        >
          Hello, {firstName} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--z-text-muted)" }}>
          {readyBooks.length > 0
            ? `You have ${readyBooks.length} book${readyBooks.length !== 1 ? "s" : ""} ready to explore.`
            : "Upload your first book to get started."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          icon={BookOpen}
          label="Books in library"
          value={books.length}
          href="/app/library"
          gold={books.length > 0}
        />
        <StatCard
          icon={MessageSquare}
          label="Conversations"
          value={conversations.length}
          href="/app/conversations"
        />
      </div>

      {/* Quick actions */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--z-text-muted)" }}
        >
          Quick actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/library"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: "var(--z-gold)",
              color: "#0d0d0d",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--z-gold-light)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--z-gold)")
            }
          >
            <Upload className="w-4 h-4" />
            Upload a book
          </Link>
          {readyBooks.length > 0 && (
            <Link
              href="/app/library"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: "var(--z-bg-surface)",
                color: "var(--z-text-secondary)",
                border: "1px solid var(--z-border)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--z-border-gold)";
                (e.currentTarget as HTMLElement).style.color = "var(--z-gold)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--z-border)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--z-text-secondary)";
              }}
            >
              <Sparkles className="w-4 h-4" />
              Start chatting
            </Link>
          )}
        </div>
      </div>

      {/* Recent conversations */}
      {recentConversations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--z-text-muted)" }}
            >
              Recent conversations
            </p>
            <Link
              href="/app/conversations"
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--z-gold)" }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
                style={{
                  backgroundColor: "var(--z-bg-surface)",
                  border: "1px solid var(--z-border)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "var(--z-border-gold)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.borderColor =
                    "var(--z-border)")
                }
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--z-gold-muted)",
                    border: "1px solid var(--z-border-gold)",
                  }}
                >
                  <MessageSquare
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--z-gold)" }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--z-text-primary)" }}
                  >
                    {conv.title ?? "Untitled conversation"}
                  </p>
                  {conv.lastMessage && (
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: "var(--z-text-muted)" }}
                    >
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
                <span
                  className="flex items-center gap-1 text-xs shrink-0"
                  style={{ color: "var(--z-text-muted)" }}
                >
                  <Clock className="w-3 h-3" />
                  {timeAgo(conv.updatedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no books at all */}
      {books.length === 0 && (
        <div
          className="rounded-xl p-10 flex flex-col items-center gap-4 text-center"
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
              No books yet
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--z-text-muted)" }}
            >
              Upload a PDF to start a conversation with Zaydoun.
            </p>
          </div>
          <Link
            href="/app/library"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: "var(--z-gold)", color: "#0d0d0d" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--z-gold-light)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--z-gold)")
            }
          >
            <Upload className="w-4 h-4" />
            Upload your first book
          </Link>
        </div>
      )}
    </div>
  );
}
