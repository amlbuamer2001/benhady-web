import { cn } from "@/lib/cn";

export type FieldSize = "md" | "sm";

interface FieldBoxOptions {
  invalid?: boolean;
  size?: FieldSize;
}

/**
 * The pill every control shares (text inputs, select / date / time triggers…), so they all
 * hover, focus, open and error the same way. Works on a wrapper (`focus-within`) or on the
 * focusable element itself, and picks up Radix's `data-state=open` on triggers.
 */
export function fieldBox({ invalid, size = "md" }: FieldBoxOptions = {}) {
  return cn(
    "group/field relative flex w-full items-center gap-3 rounded-full border bg-field text-start text-sm text-ink outline-none focus-visible:outline-none",
    "transition-[border-color,box-shadow,background-color] duration-200",
    "hover:border-ink/20",
    "focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/15",
    "data-[state=open]:border-primary data-[state=open]:bg-white data-[state=open]:ring-4 data-[state=open]:ring-primary/15",
    "has-disabled:cursor-not-allowed has-disabled:opacity-60 disabled:cursor-not-allowed disabled:opacity-60",
    size === "md" ? "h-12 px-5" : "h-11 px-4",
    invalid
      ? "border-danger hover:border-danger focus-within:border-danger focus-within:ring-danger/15 data-[state=open]:border-danger data-[state=open]:ring-danger/15"
      : "border-line",
  );
}

/** Leading/trailing icons inside a field: muted, turning green while the field is active. */
export const fieldIcon =
  "shrink-0 text-muted transition-colors duration-200 group-focus-within/field:text-primary group-data-[state=open]/field:text-primary";

/** Floating panels (select menus, calendars, time lists). */
export const panelClass = cn(
  "z-50 rounded-3xl border border-line bg-white p-2 text-ink shadow-[0_18px_50px_-18px_rgb(0_0_0_/_0.3)] outline-none",
  "data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
);
