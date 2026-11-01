"use client";
import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { CalendarIcon, EyeIcon, EyeOffIcon, SaudiFlag } from "@/components/icons";
import { maskDmy } from "@/lib/date";
import { useState } from "react";

/* ---------- Shell: label + control + error/hint ---------- */
interface ShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FieldShell({ id, label, error, hint, children }: ShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className="text-xs text-danger">
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

/* ---------- Pill input with optional start/end slots ---------- */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  start?: ReactNode;
  end?: ReactNode;
  ref?: Ref<HTMLInputElement>;
  wrapperClassName?: string;
}

export function Input({ invalid, start, end, className, wrapperClassName, ref, ...rest }: InputProps) {
  return (
    <div
      className={cn(
        "flex h-12 w-full items-center gap-3 rounded-full border bg-field px-5 transition-shadow",
        "focus-within:ring-2 focus-within:ring-primary/40",
        invalid ? "border-danger" : "border-line",
        wrapperClassName,
      )}
    >
      {start}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn("min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted", className)}
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
}

export function TextField({ label, error, hint, ...input }: BaseFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Input id={id} invalid={!!error} aria-describedby={error || hint ? `${id}-msg` : undefined} {...input} />
    </FieldShell>
  );
}

export function PasswordField({ label, error, hint, ...input }: BaseFieldProps) {
  const id = useId();
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Input
        id={id}
        dir="ltr"
        type={visible ? "text" : "password"}
        invalid={!!error}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        end={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t("hidePassword") : t("showPassword")}
            aria-pressed={visible}
            className="text-muted hover:text-ink"
          >
            {visible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        }
        {...input}
      />
    </FieldShell>
  );
}

/** Country code pill is always on the left (matches the design in both languages). */
export function PhoneField({ label, error, hint, ...input }: BaseFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div dir="ltr" className="flex gap-2">
        <div className="flex h-12 shrink-0 items-center gap-2 rounded-full border border-line bg-field px-4 text-sm text-ink">
          <SaudiFlag />
          <span>+966</span>
        </div>
        <Input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          invalid={!!error}
          aria-describedby={error || hint ? `${id}-msg` : undefined}
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
}

/** DD/MM/YYYY masked text input. Value stays in UI format; convert with dmyToIso before sending. */
export function DateField({ label, error, hint, value, onChange, ...input }: DateFieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <Input
        id={id}
        dir="ltr"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(maskDmy(e.target.value))}
        invalid={!!error}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        end={<CalendarIcon className="text-muted" />}
        {...input}
      />
    </FieldShell>
  );
}
