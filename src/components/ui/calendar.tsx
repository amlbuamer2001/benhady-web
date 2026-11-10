"use client";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";
import { DayPicker, getDefaultClassNames, type ChevronProps } from "react-day-picker";
import { ar } from "react-day-picker/locale/ar";
import { enUS } from "react-day-picker/locale/en-US";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

function Chevron({ orientation = "left", className }: ChevronProps) {
  const rotate = { up: "rotate-180", down: "", left: "rotate-90 rtl:-rotate-90", right: "-rotate-90 rtl:rotate-90" }[orientation];
  return <ChevronDownIcon width={16} height={16} className={cn(rotate, className)} />;
}

/** shadcn-style calendar on react-day-picker, themed for the site and localized (Arabic is RTL). */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: ComponentProps<typeof DayPicker>) {
  const locale = useLocale();
  const d = getDefaultClassNames();
  const navButton =
    "grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-primary-100 hover:text-primary disabled:pointer-events-none disabled:opacity-30";

  return (
    <DayPicker
      locale={locale === "ar" ? ar : enUS}
      dir={locale === "ar" ? "rtl" : "ltr"}
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        root: cn("w-fit", d.root),
        months: cn("relative flex flex-col gap-4", d.months),
        month: cn("flex w-full flex-col gap-3", d.month),
        nav: cn("absolute inset-x-0 top-0 flex items-center justify-between", d.nav),
        button_previous: cn(navButton, d.button_previous),
        button_next: cn(navButton, d.button_next),
        month_caption: cn("flex h-9 items-center justify-center px-10", d.month_caption),
        caption_label: cn(
          "flex items-center gap-1 text-sm font-bold select-none",
          props.captionLayout?.startsWith("dropdown") && "h-8 rounded-full ps-3 pe-2 [&>svg]:text-muted",
          d.caption_label,
        ),
        dropdowns: cn("flex items-center justify-center gap-1.5", d.dropdowns),
        dropdown_root: cn(
          "relative rounded-full border border-line transition-colors hover:border-primary has-focus:border-primary has-focus:ring-2 has-focus:ring-primary/20",
          d.dropdown_root,
        ),
        dropdown: cn("absolute inset-0 cursor-pointer opacity-0", d.dropdown),
        month_grid: "w-full border-collapse",
        weekdays: cn("flex", d.weekdays),
        weekday: cn("w-10 pb-1 text-[11px] font-bold text-muted select-none", d.weekday),
        week: cn("mt-1 flex w-full", d.week),
        day: cn("group/day relative size-10 p-0 text-center text-sm select-none", d.day),
        day_button: cn(
          "grid size-10 place-items-center rounded-full transition-[background-color,color,transform] duration-150",
          "hover:bg-primary-100 hover:text-primary active:scale-90",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
          d.day_button,
        ),
        today: cn("[&>button]:font-bold [&>button]:text-primary [&>button]:ring-1 [&>button]:ring-primary/40 [&>button]:ring-inset", d.today),
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-white [&>button]:shadow-[0_6px_14px_-4px_rgb(118_196_25_/_0.7)] [&>button]:hover:bg-primary-hover [&>button]:hover:text-white",
          d.selected,
        ),
        outside: cn("text-muted/60 aria-selected:text-white", d.outside),
        disabled: cn("pointer-events-none text-muted/40 line-through decoration-muted/40", d.disabled),
        hidden: cn("invisible", d.hidden),
        ...classNames,
      }}
      components={{ Chevron }}
      {...props}
    />
  );
}
