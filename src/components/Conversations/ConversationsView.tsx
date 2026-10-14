"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquarePlus, Search, Trash2 } from "lucide-react";
import {
  ActionMenu,
  BookSpine,
  Button,
  ConfirmDialog,
  EmptyState,
  Input,
  Select,
  Skeleton,
} from "@/components/ui";
import { NewConversationDialog } from "./NewConversationDialog";
import { conversationTitle } from "@/lib/conversations";
import { booksService } from "@/lib/api/services/books.service";
import { conversationsService } from "@/lib/api/services/conversations.service";
import { useToast } from "@/contexts/ToastContext";
import { LANGUAGES, isArabic } from "@/lib/languages";
import { recencyGroup, relativeTime } from "@/lib/time";
import { cn } from "@/lib/cn";
import type { BookSummary } from "@/types/books.types";
import type { ConversationSummary } from "@/types/conversations.types";

const GROUPS = ["Today", "This week", "Earlier"] as const;

export default function ConversationsView() {
  const { notify } = useToast();
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [query, setQuery] = useState("");
  const [bookFilter, setBookFilter] = useState("all");
  const [newOpen, setNewOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ConversationSummary | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    Promise.all([conversationsService.list(), booksService.list().catch(() => [])])
      .then(([c, b]) => {
        setConversations([...c].sort((x, y) => y.updatedAt.localeCompare(x.updatedAt)));
        setBooks(b);
      })
      .catch((err: unknown) =>
        notify(err instanceof Error ? err.message : "Couldn't load conversations", "error"),
      );
  }, [notify]);

  const bookById = useMemo(() => new Map(books.map((b) => [b.id, b])), [books]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (conversations ?? []).filter((c) => {
      if (bookFilter !== "all" && c.bookId !== bookFilter) return false;
      if (!q) return true;
      const book = bookById.get(c.bookId);
      return [c.title, book?.title, c.lastMessage?.content]
        .filter(Boolean)
        .some((t) => t!.toLowerCase().includes(q));
    });
  }, [conversations, query, bookFilter, bookById]);

  const grouped = useMemo(
    () =>
      GROUPS.map((g) => ({
        label: g,
        items: visible.filter((c) => recencyGroup(c.updatedAt) === g),
      })).filter((g) => g.items.length > 0),
    [visible],
  );

  const bookCount = new Set((conversations ?? []).map((c) => c.bookId)).size;
  const total = conversations?.length ?? 0;

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await conversationsService.delete(toDelete.id);
      setConversations((prev) => prev?.filter((c) => c.id !== toDelete.id) ?? prev);
      notify("Conversation deleted", "success");
      setDeleteOpen(false);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40">
            Conversations
          </h1>
          {conversations && (
            <p className="text-sm text-text-secondary">
              {total} {total === 1 ? "conversation" : "conversations"}
              {bookCount > 0 && ` across ${bookCount} ${bookCount === 1 ? "book" : "books"}`}
            </p>
          )}
        </div>
        <Button onClick={() => setNewOpen(true)}>
          <MessageSquarePlus size={18} aria-hidden />
          New conversation
        </Button>
      </header>

      {conversations === null ? (
        <div className="flex flex-col gap-2.5" aria-busy>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[76px] rounded-md" />
          ))}
        </div>
      ) : total === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Pick a book Zaydoun has read and ask him anything about it."
          action={
            <Button onClick={() => setNewOpen(true)}>
              <MessageSquarePlus size={18} aria-hidden />
              Start one
            </Button>
          }
          className="py-16"
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <Input
              label="Search conversations"
              hideLabel
              icon={Search}
              type="search"
              placeholder="Search conversations"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              wrapperClassName="flex-[1_1_280px] max-w-[420px]"
              surface
            />
            <Select
              label="Filter by book"
              hideLabel
              value={bookFilter}
              onChange={(e) => setBookFilter(e.target.value)}
              surface
            >
              <option value="all">All books</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </Select>
          </div>

          {grouped.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-secondary">
              No conversations match {query.trim() ? `“${query.trim()}”` : "this filter"}.
            </p>
          ) : (
            grouped.map((group) => (
              <section key={group.label} aria-label={group.label} className="flex flex-col gap-2.5">
                <h2 className="text-xs font-medium tracking-[0.1em] text-text-secondary uppercase">
                  {group.label}
                </h2>
                {group.items.map((c) => {
                  const book = bookById.get(c.bookId);
                  const last = c.lastMessage;
                  const speaker = last ? (last.role === "assistant" ? "Zaydoun" : "You") : null;
                  const preview = last ? `${speaker}: ${last.content.replace(/\s+/g, " ")}` : "No messages yet";
                  const arabicPreview = isArabic(c.languageCode, last?.content);
                  const langName =
                    LANGUAGES.find((l) => l.code === c.languageCode)?.nativeName ?? c.languageCode;
                  return (
                    <div
                      key={c.id}
                      className="group relative flex items-center gap-4 rounded-md border border-border bg-bg-surface px-4 py-4 transition-colors hover:border-border-strong hover:bg-bg-elevated md:px-5"
                    >
                      <BookSpine dimmed={book?.status !== "READY"} />
                      <Link
                        href={`/app/conversations/${c.id}`}
                        className="flex min-w-0 flex-1 flex-col gap-1 after:absolute after:inset-0 after:rounded-md"
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span dir="auto" className="truncate text-base font-medium">
                            {conversationTitle(c, book?.title)}
                          </span>
                          <span
                            className={cn(
                              "hidden h-[22px] shrink-0 items-center rounded-xs border border-border px-2 text-xs text-text-secondary sm:inline-flex",
                              c.languageCode === "ar" && "font-arabic text-sm",
                            )}
                          >
                            {langName}
                          </span>
                        </span>
                        <span
                          dir="auto"
                          className={cn(
                            "truncate text-text-secondary",
                            arabicPreview ? "font-arabic text-base" : "text-sm",
                          )}
                        >
                          {[book?.title, preview].filter(Boolean).join(" · ")}
                        </span>
                      </Link>
                      <span className="hidden text-13 whitespace-nowrap text-text-secondary sm:inline">
                        {relativeTime(c.updatedAt)}
                      </span>
                      {/* Above the stretched link so the menu stays clickable */}
                      <span className="relative z-10">
                        <ActionMenu
                          appearance="plain"
                          ariaLabel={`Actions for ${conversationTitle(c, book?.title)}`}
                          items={[
                            {
                              label: "Delete conversation",
                              icon: Trash2,
                              destructive: true,
                              onSelect: () => {
                                setToDelete(c);
                                setDeleteOpen(true);
                              },
                            },
                          ]}
                        />
                      </span>
                    </div>
                  );
                })}
              </section>
            ))
          )}
        </>
      )}

      <NewConversationDialog open={newOpen} onClose={() => setNewOpen(false)} books={books} />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete this conversation?"
        description={
          toDelete
            ? `“${conversationTitle(toDelete, bookById.get(toDelete.bookId)?.title)}” and its messages will be removed for good. The book stays on your shelf.`
            : undefined
        }
        confirmLabel="Delete conversation"
        cancelLabel="Keep it"
      />
    </div>
  );
}
