import { useCallback } from "react";
import { useTranslations } from "next-intl";
import type { ConversationSummary } from "@/types/conversations.types";

// Conversations often have no title — fall back to the book they're about
export function useConversationTitle() {
  const t = useTranslations("conversations.fallbackTitle");
  return useCallback(
    (c: ConversationSummary, bookTitle?: string): string =>
      c.title?.trim() || (bookTitle ? t("about", { title: bookTitle }) : t("new")),
    [t],
  );
}
