import { useCallback } from "react";
import { useLocale } from "next-intl";

const capitalize = (s: string, locale: string) =>
  s.charAt(0).toLocaleUpperCase(locale) + s.slice(1);

// "just now" · "5 min ago" · "2 hours ago" · "Yesterday" · "Oct 10" · "Oct 10, 2025"
// — worded and formatted in the UI language
export function relativeTime(iso: string, locale: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "short",
  });
  const min = Math.floor(diff / 60_000);
  if (min < 1) return capitalize(rtf.format(0, "second"), locale);
  if (min < 60) return rtf.format(-min, "minute");
  const hours = Math.floor(min / 60);
  const today = new Date();
  if (hours < 24 && date.getDate() === today.getDate())
    return rtf.format(-hours, "hour");
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString())
    return capitalize(rtf.format(-1, "day"), locale);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== today.getFullYear() && { year: "numeric" }),
  });
}

/** relativeTime bound to the current UI language */
export function useRelativeTime() {
  const locale = useLocale();
  return useCallback((iso: string) => relativeTime(iso, locale), [locale]);
}

/** Date formatting in the current UI language */
export function useFormatDate() {
  const locale = useLocale();
  return useCallback(
    (date: string | Date, options: Intl.DateTimeFormatOptions) =>
      new Date(date).toLocaleDateString(locale, options),
    [locale],
  );
}

// Today / This week / Earlier — for grouping lists by recency
// (keys in conversations.json → groups)
export function recencyGroup(iso: string): "today" | "thisWeek" | "earlier" {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "today";
  return today.getTime() - date.getTime() < 7 * 86_400_000 ? "thisWeek" : "earlier";
}
