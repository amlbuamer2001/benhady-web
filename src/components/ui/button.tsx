import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface StyleOptions {
  variant?: "solid" | "outline";
  size?: "md" | "sm";
  fullWidth?: boolean;
}

/** Shared class builder so <Link> and <button> render identical pills. */
export function buttonClasses({ variant = "solid", size = "md", fullWidth }: StyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-60",
    size === "md" ? "h-12 px-8" : "h-11 px-7",
    variant === "solid"
      ? "bg-primary text-white hover:bg-primary-hover"
      : "border border-primary bg-white text-primary hover:bg-primary-50",
    fullWidth && "w-full",
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyleOptions {
  loading?: boolean;
}

export function Button({ variant, size, fullWidth, loading, className, children, disabled, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {loading && (
        <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
