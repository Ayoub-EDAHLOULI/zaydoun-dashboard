"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";
import { ArrowUp, Check, Copy, Mic } from "lucide-react";
import { isArabic } from "@/lib/languages";
import { cn } from "@/lib/cn";
import { Orb } from "./Orb";
import { PageTag } from "./Badges";

// ---------------------------------------------------------------------------
// ChatMessage
// User: compact right-aligned bubble. Zaydoun: no bubble — small orb, gold
// name, the answer in the reading serif, then page tags and a copy button.
// ---------------------------------------------------------------------------

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  /** Pages cited by this answer */
  pages?: number[];
  /** Conversation reply language — "ar" switches to Amiri + RTL */
  languageCode?: string;
  onPageClick?: (page: number) => void;
}

export function ChatMessage({
  role,
  content,
  pages = [],
  languageCode,
  onPageClick,
}: ChatMessageProps) {
  const arabic = isArabic(languageCode, content);

  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div
          dir={arabic ? "rtl" : "auto"}
          lang={arabic ? "ar" : undefined}
          className={cn(
            "max-w-[80%] rounded-[16px] rounded-ee-[4px] bg-bg-elevated px-4 whitespace-pre-wrap break-words",
            arabic
              ? "py-2.5 font-arabic text-19 leading-[1.7]"
              : "py-3 text-15 leading-[1.55]",
          )}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div
      dir={arabic ? "rtl" : "auto"}
      lang={arabic ? "ar" : undefined}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2.5">
        <Orb size={24} />
        <span
          className={cn(
            "font-semibold text-gold-light",
            arabic ? "font-arabic text-15 font-bold" : "text-13",
          )}
        >
          {arabic ? "زيدون" : "Zaydoun"}
        </span>
      </div>
      <p
        className={cn(
          "whitespace-pre-wrap break-words text-text-primary",
          arabic
            ? "font-arabic text-21 leading-[1.85]"
            : "font-serif text-19 leading-[1.65]",
        )}
      >
        {content}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {pages.map((p) => (
          <PageTag
            key={p}
            page={p}
            arabic={arabic}
            onClick={onPageClick ? () => onPageClick(p) : undefined}
          />
        ))}
        <CopyButton text={content} />
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const t = useTranslations("common.chat");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard
          .writeText(text)
          .then(() => setCopied(true))
          .catch(() => {})
      }
      aria-label={copied ? t("copied") : t("copy")}
      title={copied ? t("copied") : t("copy")}
      className="flex size-8 items-center justify-center rounded-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
    >
      {copied ? (
        <Check size={16} aria-hidden />
      ) : (
        <Copy size={16} aria-hidden />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// ThinkingIndicator — breathing orb + italic serif line
// ---------------------------------------------------------------------------

export function ThinkingIndicator({
  label,
}: {
  label?: string;
}) {
  const t = useTranslations("common.chat");
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3">
      <Orb size={24} breathing />
      <span className="font-serif text-base italic text-text-secondary">
        {label ?? t("thinking")}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composer — textarea, mic (coming soon), gold send, hint row
// Enter sends, Shift+Enter adds a new line.
// ---------------------------------------------------------------------------

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  /** True while a reply is on its way */
  sending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Left side of the hint row */
  hint?: string;
  /** Right side of the hint row, e.g. "11 of 15 messages left today" */
  quota?: string;
}

const MAX_HEIGHT = 200;

export function Composer({
  value,
  onChange,
  onSend,
  sending = false,
  disabled = false,
  placeholder,
  hint,
  quota,
}: ComposerProps) {
  const t = useTranslations("common.chat");
  const ref = useRef<HTMLTextAreaElement>(null);
  const canSend = value.trim().length > 0 && !sending && !disabled;

  // Grow with the content up to MAX_HEIGHT
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-2 rounded-[14px] border border-border bg-bg-surface py-2 ps-4 pe-2 transition-colors focus-within:border-border-gold">
        <label htmlFor="composer-input" className="sr-only">
          {t("messageLabel")}
        </label>
        <textarea
          id="composer-input"
          ref={ref}
          rows={1}
          dir="auto"
          value={value}
          disabled={disabled}
          placeholder={placeholder ?? t("placeholder")}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-7 flex-1 resize-none self-center bg-transparent py-1.5 text-15 leading-normal max-md:text-[16px] text-text-primary placeholder:text-text-muted focus-visible:outline-none disabled:cursor-not-allowed"
        />
        <span className="relative">
          <button
            type="button"
            disabled
            aria-label={t("voiceSoon")}
            className="flex size-10 cursor-not-allowed items-center justify-center rounded-[10px] text-text-muted"
          >
            <Mic size={18} aria-hidden />
          </button>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-xs bg-bg-elevated px-1 text-9 font-semibold tracking-[0.08em] whitespace-nowrap text-text-secondary"
          >
            {t("soon")}
          </span>
        </span>
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend}
          aria-label={t("send")}
          className="flex size-10 items-center justify-center rounded-[10px] bg-gold text-bg-base transition-colors enabled:hover:bg-gold-light enabled:active:bg-gold-dark disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-muted"
        >
          <ArrowUp size={18} strokeWidth={2.2} aria-hidden />
        </button>
      </div>
      {(hint || quota) && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span>{hint}</span>
          {quota && <span className="tabular-nums">{quota}</span>}
        </div>
      )}
    </div>
  );
}
