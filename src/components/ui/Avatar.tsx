import { cn } from "@/lib/cn";

function initials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  const letters =
    parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

export function Avatar({
  name,
  email,
  size = 36,
  highlight = false,
  className,
}: {
  name?: string | null;
  email?: string | null;
  size?: number;
  /** Gold initials — used for the signed-in user */
  highlight?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated font-semibold",
        highlight ? "text-gold-light" : "text-text-secondary",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials(name, email)}
    </span>
  );
}
