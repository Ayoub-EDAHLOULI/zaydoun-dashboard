"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// Shared label / hint / error wrapper. Every control gets a real <label>.
// ---------------------------------------------------------------------------

interface FieldProps {
  id: string;
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  /** Label beside the control instead of above it (no hint/error row) */
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

function Field({
  id,
  label,
  hideLabel,
  hint,
  error,
  disabled,
  inline,
  className,
  children,
}: FieldProps) {
  return (
    <div
      className={cn(
        "flex",
        inline ? "flex-row items-center gap-2.5" : "flex-col gap-2",
        className,
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "text-13 font-medium",
          disabled ? "text-text-muted" : "text-text-secondary",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>
      {children}
      {error ? (
        <span id={`${id}-error`} className="text-xs text-error">
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className="text-xs text-text-secondary">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: ReactNode, hint?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

const controlClasses = (hasError: boolean, surface?: boolean) =>
  cn(
    // 16px below md: iOS Safari zooms into any field under 16px on focus.
    // Deliberately unscaled (not affected by --font-scale).
    "w-full rounded-sm border text-15 max-md:text-[16px]",
    surface ? "bg-bg-surface" : "bg-bg-elevated",
    "text-text-primary placeholder:text-text-muted transition-[border-color,box-shadow]",
    "focus-visible:outline-none focus:border-gold focus:shadow-[0_0_0_3px_var(--color-gold-muted)]",
    "disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-bg-surface disabled:text-text-muted",
    hasError ? "border-error" : "border-border",
  );

type Common = {
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  wrapperClassName?: string;
  inline?: boolean;
  /** Darker fill, for controls sitting directly on the page (search, toolbars) */
  surface?: boolean;
};

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, Common {
  /** Icon shown inside the field on the left (e.g. Search) */
  icon?: LucideIcon;
  /** Control inside the field on the right (e.g. a show-password button) */
  end?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hideLabel,
    hint,
    error,
    wrapperClassName,
    surface,
    icon: Icon,
    end,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <Field
      id={fieldId}
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      disabled={disabled}
      className={wrapperClassName}
    >
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-text-secondary"
          />
        )}
        <input
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(
            controlClasses(!!error, surface),
            "h-11 px-3.5",
            Icon && "pl-10.5",
            !!end && "pr-12",
            className,
          )}
          {...rest}
        />
        {end && (
          <div className="absolute top-0 right-0.5 flex h-11 items-center">
            {end}
          </div>
        )}
      </div>
    </Field>
  );
});

// ---------------------------------------------------------------------------
// Select (native, so it stays accessible and mobile-friendly)
// ---------------------------------------------------------------------------

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>, Common {}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      id,
      label,
      hideLabel,
      hint,
      error,
      wrapperClassName,
      inline,
      surface,
      className,
      disabled,
      children,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <Field
        id={fieldId}
        label={label}
        hideLabel={hideLabel}
        hint={hint}
        error={error}
        disabled={disabled}
        inline={inline}
        className={wrapperClassName}
      >
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            disabled={disabled}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy(fieldId, error, hint)}
            className={cn(
              controlClasses(!!error, surface),
              "h-11 cursor-pointer appearance-none pr-10 pl-3.5",
              className,
            )}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown
            size={18}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-text-secondary"
          />
        </div>
      </Field>
    );
  },
);

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>, Common {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      label,
      hideLabel,
      hint,
      error,
      wrapperClassName,
      surface,
      className,
      disabled,
      rows = 4,
      ...rest
    },
    ref,
  ) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <Field
        id={fieldId}
        label={label}
        hideLabel={hideLabel}
        hint={hint}
        error={error}
        disabled={disabled}
        className={wrapperClassName}
      >
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(
            controlClasses(!!error, surface),
            "resize-y px-3.5 py-3 leading-normal",
            className,
          )}
          {...rest}
        />
      </Field>
    );
  },
);
