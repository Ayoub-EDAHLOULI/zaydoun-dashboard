import { forwardRef, type ButtonHTMLAttributes } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-bg-base font-semibold enabled:hover:bg-gold-light enabled:active:bg-gold-dark disabled:bg-bg-elevated disabled:text-text-muted",
  secondary:
    "border border-border bg-bg-elevated text-text-primary font-medium enabled:hover:border-border-strong enabled:hover:bg-bg-overlay enabled:active:bg-bg-surface disabled:border-border-subtle disabled:bg-bg-surface disabled:text-text-disabled",
  ghost:
    "bg-transparent text-text-secondary font-medium enabled:hover:bg-bg-elevated enabled:hover:text-text-primary enabled:active:bg-bg-overlay disabled:text-text-disabled",
  destructive:
    "bg-error text-bg-base font-semibold focus-visible:outline-error enabled:hover:bg-error-text enabled:active:brightness-[0.82] disabled:bg-bg-elevated disabled:text-text-muted",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-15",
  lg: "h-[52px] px-6 text-base", // marketing CTAs
};

// Also used to style <Link>s as buttons
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-sm whitespace-nowrap transition-colors disabled:cursor-not-allowed [&_svg]:shrink-0",
    VARIANTS[variant],
    SIZES[size],
    variant === "ghost" && size !== "lg" && "px-4",
    fullWidth && "w-full",
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Shows a spinner and disables the button */
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth,
      loading = false,
      disabled,
      className,
      children,
      type = "button",
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={buttonClasses({ variant, size, fullWidth, className })}
        {...rest}
      >
        {loading && (
          <LoaderCircle size={18} className="animate-spin" aria-hidden />
        )}
        {children}
      </button>
    );
  },
);
