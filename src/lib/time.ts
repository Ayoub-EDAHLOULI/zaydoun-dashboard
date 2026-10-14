// "just now" · "5m ago" · "2h ago" · "Yesterday" · "Oct 10" · "Oct 10, 2025"
export function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hours = Math.floor(min / 60);
  const today = new Date();
  if (hours < 24 && date.getDate() === today.getDate()) return `${hours}h ago`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== today.getFullYear() && { year: "numeric" }),
  });
}

// Today / This week / Earlier — for grouping lists by recency
export function recencyGroup(iso: string): "Today" | "This week" | "Earlier" {
  const date = new Date(iso);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  return today.getTime() - date.getTime() < 7 * 86_400_000 ? "This week" : "Earlier";
}
