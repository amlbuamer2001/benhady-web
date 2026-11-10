"use client";
import { useId, useState, type InputHTMLAttributes, type ReactNode, type Ref, type TextareaHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { CalendarIcon, CloseIcon, EyeIcon, EyeOffIcon, SaudiFlag, SearchIcon } from "@/components/icons";
import { maskDmy, parseDmy, toDmy } from "@/lib/date";
import { Calendar } from "./calendar";
import { PickerFooter } from "./date-picker";
import { fieldBox, fieldIcon, type FieldSize } from "./field-styles";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover";

/* ---------- Shell: label + control + error/hint ---------- */
interface ShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ id, label, error, hint, children, className }: ShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className="flex animate-pop-in items-center gap-1.5 text-xs text-danger">
          <span aria-hidden className="grid size-3.5 shrink-0 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">
            !
          </span>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-[11px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error || hint ? `${id}-msg` : undefined);

/** Small round icon button that lives inside a field (password eye, clear, calendar…). */
function FieldButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "-me-2 grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors",
        "hover:bg-primary-100 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Pill input with optional start/end slots ---------- */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  start?: ReactNode;
  end?: ReactNode;
  fieldSize?: FieldSize;
  ref?: Ref<HTMLInputElement>;
  wrapperClassName?: string;
}

export function Input({ invalid, start, end, fieldSize, className, wrapperClassName, ref, ...rest }: InputProps) {
  // Emails are Latin-only: type them left-to-right in a Latin font (still right-aligned on Arabic pages).
  const latin = rest.type === "email";
  return (
    <div className={cn(fieldBox({ invalid, size: fieldSize }), "cursor-text", wrapperClassName)}>
      {start && <span className={cn(fieldIcon, "flex")}>{start}</span>}
      <input
        ref={ref}
        dir={latin ? "ltr" : undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed",
          latin && "font-latin placeholder:font-sans rtl:text-right",
          className,
        )}
        {...rest}
      />
      {end}
    </div>
  );
}

/* ---------- Composed fields ---------- */
interface BaseFieldProps extends Omit<InputProps, "id" | "start" | "end"> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export function TextField({ label, error, hint, icon, ...input }: BaseFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Input id={id} invalid={!!error} aria-describedby={describedBy(id, error, hint)} start={icon} {...input} />
    </FieldShell>
  );
}

export function PasswordField({ label, error, hint, icon, ...input }: BaseFieldProps) {
  const id = useId();
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Input
        id={id}
        type={visible ? "text" : "password"}
        invalid={!!error}
        aria-describedby={describedBy(id, error, hint)}
        start={icon}
        end={
          <FieldButton onClick={() => setVisible((v) => !v)} aria-label={visible ? t("hidePassword") : t("showPassword")} aria-pressed={visible}>
            <span key={String(visible)} className="animate-pop-in">
              {visible ? <EyeIcon /> : <EyeOffIcon />}
            </span>
          </FieldButton>
        }
        {...input}
      />
    </FieldShell>
  );
}

/** Country code pill sits at the start edge: right in Arabic, left in English. */
export function PhoneField({ label, error, hint, ...input }: BaseFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="flex gap-2">
        <div dir="ltr" className="flex h-12 shrink-0 items-center gap-2 rounded-full border border-line bg-field px-4 text-sm font-bold text-ink">
          <SaudiFlag />
          <span>+966</span>
        </div>
        <Input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          invalid={!!error}
          aria-describedby={describedBy(id, error, hint)}
          wrapperClassName="flex-1"
          {...input}
        />
      </div>
    </FieldShell>
  );
}

interface DateFieldProps extends Omit<BaseFieldProps, "value" | "onChange" | "type"> {
  value: string;
  onChange: (value: string) => void;
  /** Bounds for the calendar (typing is still validated by the form schema). */
  minDate?: Date;
  maxDate?: Date;
}

/**
 * DD/MM/YYYY field: type it (auto-masked) or pick it from the calendar.
 * Value stays in UI format; convert with dmyToIso before sending.
 */
export function DateField({ label, error, hint, value, onChange, minDate, maxDate, ...input }: DateFieldProps) {
  const id = useId();
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const selected = parseDmy(value) ?? undefined;
  // Long ranges (birth dates, expiry years ahead) get month/year dropdowns.
  const startMonth = minDate ?? new Date(new Date().getFullYear() - 100, 0);
  const endMonth = maxDate ?? new Date(new Date().getFullYear() + 20, 11);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayAllowed = (!minDate || minDate <= today) && (!maxDate || maxDate >= today);

  const pick = (date?: Date) => {
    onChange(date ? toDmy(date) : "");
    setOpen(false);
  };

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div>
            <Input
              id={id}
              dir="ltr"
              inputMode="numeric"
              autoComplete="off"
              value={value}
              onChange={(e) => onChange(maskDmy(e.target.value))}
              invalid={!!error}
              aria-describedby={describedBy(id, error, hint)}
              className="tracking-wide rtl:text-right"
              wrapperClassName={cn(open && "border-primary bg-white ring-4 ring-primary/15")}
              end={
                <PopoverTrigger asChild>
                  <FieldButton aria-label={t("openCalendar")} className={cn(open && "bg-primary-100 text-primary")}>
                    <CalendarIcon />
                  </FieldButton>
                </PopoverTrigger>
              }
              {...input}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent className="w-auto p-3" align="end">
          <Calendar
            mode="single"
            autoFocus
            captionLayout="dropdown"
            selected={selected}
            defaultMonth={selected ?? (maxDate && maxDate < today ? maxDate : (minDate ?? today))}
            onSelect={pick}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={[...(minDate ? [{ before: minDate }] : []), ...(maxDate ? [{ after: maxDate }] : [])]}
          />
          <PickerFooter
            clearLabel={t("clear")}
            onClear={value ? () => pick(undefined) : undefined}
            todayLabel={t("today")}
            onToday={todayAllowed ? () => pick(today) : undefined}
          />
        </PopoverContent>
      </Popover>
    </FieldShell>
  );
}

/* ---------- Textarea ---------- */
interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

export function TextareaField({ label, error, hint, className, maxLength, onChange, ref, ...rest }: TextareaFieldProps) {
  const id = useId();
  const [count, setCount] = useState(0);
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className={cn(fieldBox({ invalid: !!error }), "h-auto flex-col items-stretch gap-1 rounded-3xl py-3.5")}>
        <textarea
          id={id}
          ref={ref}
          maxLength={maxLength}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy(id, error, hint)}
          onChange={(e) => {
            setCount(e.target.value.length);
            onChange?.(e);
          }}
          className={cn("min-h-24 w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted", className)}
          {...rest}
        />
        {maxLength && (
          <span aria-hidden className={cn("self-end text-[11px] tabular-nums text-muted", count >= maxLength && "text-danger")}>
            {count}/{maxLength}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

/* ---------- Search ---------- */
interface SearchInputProps extends Omit<InputProps, "type" | "value" | "onChange" | "start" | "end"> {
  value: string;
  onChange: (value: string) => void;
  /** Replaces the search icon, e.g. with a spinner while results load. */
  icon?: ReactNode;
}

/** Search pill with a leading icon and a clear (×) button once something is typed. */
export function SearchInput({ value, onChange, icon, ref, ...input }: SearchInputProps) {
  const t = useTranslations("common");
  return (
    <Input
      ref={ref}
      type="search"
      enterKeyHint="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      start={icon ?? <SearchIcon />}
      end={
        value ? (
          <FieldButton aria-label={t("clear")} onClick={() => onChange("")} className="size-7 animate-pop-in bg-line/60">
            <CloseIcon width={12} height={12} />
          </FieldButton>
        ) : null
      }
      {...input}
    />
  );
}

/* ---------- Number with − / + steppers ---------- */
interface NumberInputProps extends Omit<InputProps, "type" | "value" | "onChange" | "min" | "max" | "step" | "start" | "end"> {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Shown before the − button, e.g. a seat icon. */
  icon?: ReactNode;
}

export function NumberInput({ value, onChange, min, max, step = 1, icon, className, ...input }: NumberInputProps) {
  const t = useTranslations("common");
  const num = value === "" ? undefined : Number(value);
  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const bump = (dir: 1 | -1) => onChange(String(clamp(num === undefined ? (min ?? 0) : num + dir * step)));
  const stepper = "size-8 bg-white shadow-[0_2px_6px_-2px_rgb(0_0_0_/_0.2)] text-ink active:scale-90";

  return (
    <Input
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => {
        if (e.target.value !== "") onChange(String(clamp(Number(e.target.value))));
      }}
      className={cn("text-center tabular-nums", className)}
      start={
        <span className="flex items-center gap-2">
          {icon}
          <FieldButton aria-label={t("decrease")} onClick={() => bump(-1)} disabled={num !== undefined && min !== undefined && num <= min} className={cn(stepper, "-ms-2 me-0")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M5 12h14" />
            </svg>
          </FieldButton>
        </span>
      }
      end={
        <FieldButton aria-label={t("increase")} onClick={() => bump(1)} disabled={num !== undefined && max !== undefined && num >= max} className={stepper}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </FieldButton>
      }
      {...input}
    />
  );
}
