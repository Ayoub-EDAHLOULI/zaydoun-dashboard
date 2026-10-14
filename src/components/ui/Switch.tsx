"use client";

import { cn } from "@/lib/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible text next to the switch (e.g. "Active") */
  label: string;
  /** Accessible name when the visible label isn't specific enough */
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled = false,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex min-h-11 items-center gap-2.5 rounded-sm text-[13px] text-text-secondary disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          checked ? "bg-success" : "bg-border-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full transition-[left,background-color]",
            checked
              ? "left-[18px] bg-text-primary"
              : "left-0.5 bg-text-secondary",
          )}
        />
      </span>
      {label}
    </button>
  );
}
