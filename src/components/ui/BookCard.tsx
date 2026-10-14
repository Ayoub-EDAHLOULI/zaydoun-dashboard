import Link from "next/link";
import { LoaderCircle, type LucideIcon } from "lucide-react";
import type { BookSummary } from "@/types/books.types";
import { isArabic, languageName } from "@/lib/languages";
import { cn } from "@/lib/cn";
import { StatusBadge } from "./Badges";
import { ActionMenu, type ActionMenuItem } from "./ActionMenu";
import { buttonClasses } from "./Button";

// ---------------------------------------------------------------------------
// BookCover — generated cover: dark block, gold spine, serif title
// ---------------------------------------------------------------------------

export function BookCover({
  title,
  author,
  language,
  dimmed = false,
  size = "md",
}: {
  title: string;
  author?: string | null;
  language?: string;
  /** Dims to 60% while the book is being processed */
  dimmed?: boolean;
  /** md 128×160 (cards) · sm 112×140 · xs 76×100 (side panels) */
  size?: "xs" | "sm" | "md";
}) {
  const arabic = isArabic(language, title);
  return (
    <div
      dir={arabic ? "rtl" : "ltr"}
      lang={arabic ? "ar" : language}
      className={cn(
        "flex flex-col justify-between overflow-hidden rounded-[3px_8px_8px_3px] border-l-[6px] shadow-[0_16px_28px_-10px_rgba(0,0,0,0.8)]",
        size === "md"
          ? "h-40 w-32 px-3.5 py-4"
          : size === "sm"
            ? "h-[140px] w-28 px-3 py-3.5"
            : "h-[100px] w-[76px] border-l-4 px-2 py-2.5",
        dimmed
          ? "border-border-strong bg-bg-elevated opacity-60"
          : "border-gold-dark bg-bg-overlay",
      )}
    >
      <span
        className={cn(
          "line-clamp-4 hyphens-auto",
          arabic
            ? cn(
                "font-arabic font-bold leading-[1.25] text-gold-light",
                size === "md" ? "text-[22px]" : size === "sm" ? "text-lg" : "text-sm",
              )
            : cn(
                "font-serif font-medium leading-[1.2] text-text-primary",
                size === "md"
                  ? "text-lg tracking-[-0.01em]"
                  : size === "sm"
                    ? "text-base"
                    : "text-xs",
              ),
        )}
      >
        {title}
      </span>
      {author && (
        <span
          className={cn(
            "line-clamp-2 text-text-secondary",
            arabic
              ? "font-arabic text-[13px] leading-[1.3]"
              : "font-serif text-xs italic leading-[1.3]",
            size === "xs" && "text-[10px]",
          )}
        >
          {author}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// BookCard
// ---------------------------------------------------------------------------

export interface BookCardAction {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface BookCardProps {
  book: BookSummary;
  primaryAction: BookCardAction;
  menuItems?: ActionMenuItem[];
  /** Extra line under the meta, e.g. "3 conversations · last opened today" */
  detail?: string;
  /** Extra meta shown first, e.g. the owner on admin screens */
  owner?: string;
}

export function BookCard({
  book,
  primaryAction,
  menuItems,
  detail,
  owner,
}: BookCardProps) {
  const processing = book.status === "PROCESSING";
  const meta = [
    owner,
    book.author,
    languageName(book.language),
    book.totalPages > 0 ? `${book.totalPages} pages` : null,
  ].filter((part): part is string => !!part);

  const { label, icon: Icon, href, onClick, disabled, loading } = primaryAction;
  const actionClass = buttonClasses({ size: "sm", className: "flex-1" });
  const actionContent = (
    <>
      {loading ? (
        <LoaderCircle size={16} className="animate-spin" aria-hidden />
      ) : (
        Icon && <Icon size={16} strokeWidth={2} aria-hidden />
      )}
      {label}
    </>
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border bg-bg-surface">
      <div
        className={cn(
          "relative flex h-[200px] items-center justify-center border-b border-border",
          processing ? "bg-border-subtle" : "bg-bg-elevated",
        )}
      >
        <BookCover
          title={book.title}
          author={book.author}
          language={book.language}
          dimmed={processing}
        />
        <StatusBadge
          status={book.status}
          overlay
          className="absolute top-3 left-3"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3
          dir="auto"
          className={cn(
            "leading-[1.25] font-medium",
            isArabic(book.language, book.title)
              ? "font-arabic text-xl"
              : "font-serif text-xl",
          )}
        >
          {book.title}
        </h3>
        {meta.length > 0 && (
          // <bdi> keeps an Arabic author from reordering the rest of the line
          <p className="text-[13px] text-text-secondary">
            {meta.map((part, i) => (
              <span key={i}>
                {i > 0 && " · "}
                <bdi>{part}</bdi>
              </span>
            ))}
          </p>
        )}
        {detail && <p className="text-[13px] text-text-secondary">{detail}</p>}

        <div className="mt-auto flex gap-2 pt-3">
          {href && !disabled ? (
            <Link href={href} className={actionClass}>
              {actionContent}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClick}
              disabled={disabled || loading}
              aria-busy={loading || undefined}
              className={actionClass}
            >
              {actionContent}
            </button>
          )}
          {menuItems && menuItems.length > 0 && (
            <ActionMenu
              items={menuItems}
              ariaLabel={`More actions for ${book.title}`}
            />
          )}
        </div>
      </div>
    </article>
  );
}
