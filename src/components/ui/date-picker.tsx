"use client";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode, type Ref } from "react";
import { CalendarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { parseIso, startOfDay, toIso } from "@/lib/date";
import { Calendar } from "./calendar";
import { fieldBox, fieldIcon, type FieldSize } from "./field-styles";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DatePickerProps {
  id?: string;
  /** Y-m-d, or "" for no date. */
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  invalid?: boolean;
  disabled?: boolean;
  fieldSize?: FieldSize;
  icon?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

/** Localized date label, e.g. "Tue, 10 Nov 2026" (Latin digits in both languages, like the rest of the UI). */
export function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Pill trigger + calendar popover for Y-m-d values (filters, search). */
export function DatePicker({ value, onChange, placeholder, minDate, maxDate, invalid, disabled, fieldSize, icon, className, ...trigger }: DatePickerProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const selected = parseIso(value) ?? undefined;
  const today = startOfDay();
  const todayAllowed = (!minDate || minDate <= today) && (!maxDate || maxDate >= today);

  const pick = (date?: Date) => {
    onChange(date ? toIso(date) : "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(fieldBox({ invalid, size: fieldSize }), "cursor-pointer justify-between", className)}
        {...trigger}
      >
        <span className={cn("min-w-0 flex-1 truncate", !selected && "text-muted")}>
          {selected ? formatDate(selected, locale) : (placeholder ?? t("chooseDate"))}
        </span>
        <span className={cn(fieldIcon, "flex")}>{icon ?? <CalendarIcon />}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <Calendar
          mode="single"
          autoFocus
          selected={selected}
          defaultMonth={selected ?? minDate}
          onSelect={pick}
          startMonth={minDate}
          endMonth={maxDate}
          disabled={[...(minDate ? [{ before: minDate }] : []), ...(maxDate ? [{ after: maxDate }] : [])]}
        />
        <PickerFooter
          clearLabel={t("clear")}
          onClear={selected ? () => pick(undefined) : undefined}
          todayLabel={t("today")}
          onToday={todayAllowed ? () => pick(today) : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}

/** "Clear" / "Today" row under a calendar. A missing handler hides (clear) or disables (today) its button. */
export function PickerFooter({ clearLabel, onClear, todayLabel, onToday }: { clearLabel: string; onClear?: () => void; todayLabel: string; onToday?: () => void }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-3">
      <button
        type="button"
        onClick={onClear}
        disabled={!onClear}
        className="h-9 rounded-full px-4 text-xs font-bold text-danger transition-colors hover:bg-danger/10 disabled:invisible"
      >
        {clearLabel}
      </button>
      <button
        type="button"
        onClick={onToday}
        disabled={!onToday}
        className="h-9 rounded-full bg-primary-100 px-4 text-xs font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        {todayLabel}
      </button>
    </div>
  );
}
