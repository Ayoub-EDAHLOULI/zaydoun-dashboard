import type { ConversationSummary } from "@/types/conversations.types";

// Conversations often have no title — fall back to the book they're about
export function conversationTitle(c: ConversationSummary, bookTitle?: string): string {
  return c.title?.trim() || (bookTitle ? `About ${bookTitle}` : "New conversation");
}
