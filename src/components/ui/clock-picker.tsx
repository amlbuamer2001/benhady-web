"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type Ref } from "react";
import { ClockIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { fieldBox, fieldIcon, type FieldSize } from "./field-styles";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface ClockPickerProps {
  id?: string;
  /** HH:mm (24h), or "" for no time. */
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Minutes snap to multiples of this. */
  minuteStep?: number;
  invalid?: boolean;
  disabled?: boolean;
  fieldSize?: FieldSize;
  icon?: ReactNode;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

type View = "hours" | "minutes";
type Period = "AM" | "PM";

const pad = (n: number) => String(n).padStart(2, "0");

/** "14:30" -> "2:30 PM" / "2:30 م". */
export function formatTime(value: string, locale: string) {
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-US", { hour: "numeric", minute: "2-digit" }).format(
    new Date(2000, 0, 1, h, m),
  );
}

function parse(value?: string) {
  const m = /^(\d{1,2}):(\d{2})/.exec(value ?? "");
  const h = m ? Number(m[1]) : 9;
  return { hour: h % 12 || 12, minute: m ? Number(m[2]) : 0, period: (h >= 12 ? "PM" : "AM") as Period };
}

/** Pill trigger + analog clock: pick the hour on the dial, then the minutes, then AM/PM. */
export function ClockPicker({ value, onChange, placeholder, minuteStep = 5, invalid, disabled, fieldSize, icon, className, ...trigger }: ClockPickerProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("hours");
  const [draft, setDraft] = useState(() => parse(value));

  const openChange = (next: boolean) => {
    if (next) {
      setDraft(parse(value));
      setView("hours");
    }
    setOpen(next);
  };

  const confirm = () => {
    const h24 = (draft.hour % 12) + (draft.period === "PM" ? 12 : 0);
    onChange(`${pad(h24)}:${pad(draft.minute)}`);
    setOpen(false);
  };

  const clear = () => {
    onChange("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={openChange}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(fieldBox({ invalid, size: fieldSize }), "cursor-pointer justify-between", className)}
        {...trigger}
      >
        <span className={cn("min-w-0 flex-1 truncate", !value && "text-muted")}>{value ? formatTime(value, locale) : (placeholder ?? t("chooseTime"))}</span>
        <span className={cn(fieldIcon, "flex")}>{icon ?? <ClockIcon />}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" onOpenAutoFocus={(e) => e.preventDefault()}>
        {/* Digital readout: tap hour / minutes to switch the dial; AM/PM beside it. */}
        <div className="flex items-center justify-center gap-3">
          <div dir="ltr" className="flex items-center gap-1 text-4xl font-bold tabular-nums">
            <Segment active={view === "hours"} onClick={() => setView("hours")} label={t("hour")}>
              {pad(draft.hour)}
            </Segment>
            <span className="animate-pulse text-muted">:</span>
            <Segment active={view === "minutes"} onClick={() => setView("minutes")} label={t("minute")}>
              {pad(draft.minute)}
            </Segment>
          </div>
          <div role="radiogroup" className="flex flex-col gap-1 rounded-2xl bg-field p-1">
            {(["AM", "PM"] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={draft.period === p}
                onClick={() => setDraft((d) => ({ ...d, period: p }))}
                className={cn(
                  "h-8 min-w-11 rounded-xl px-2 text-xs font-bold transition-colors",
                  draft.period === p ? "bg-primary text-white shadow-[0_4px_10px_-4px_rgb(118_196_25_/_0.8)]" : "text-muted hover:text-ink",
                )}
              >
                {t(p === "AM" ? "am" : "pm")}
              </button>
            ))}
          </div>
        </div>

        <Dial
          view={view}
          hour={draft.hour}
          minute={draft.minute}
          minuteStep={minuteStep}
          label={view === "hours" ? t("hour") : t("minute")}
          onHour={(hour) => setDraft((d) => ({ ...d, hour }))}
          onMinute={(minute) => setDraft((d) => ({ ...d, minute }))}
          onHourDone={() => setView("minutes")}
          onMinuteDone={confirm}
        />

        <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={clear}
            disabled={!value}
            className="h-9 rounded-full px-4 text-xs font-bold text-danger transition-colors hover:bg-danger/10 disabled:invisible"
          >
            {t("clear")}
          </button>
          <button
            type="button"
            onClick={confirm}
            className="h-9 rounded-full bg-primary px-5 text-xs font-bold text-white transition-colors hover:bg-primary-hover active:scale-95"
          >
            {t("confirm")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Segment({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn("rounded-2xl px-2.5 py-1 transition-colors", active ? "bg-primary-100 text-primary" : "text-ink hover:bg-field")}
    >
      {children}
    </button>
  );
}

const SIZE = 248;
const RADIUS = 92;

interface DialProps {
  view: View;
  hour: number;
  minute: number;
  minuteStep: number;
  label: string;
  onHour: (h: number) => void;
  onMinute: (m: number) => void;
  onHourDone: () => void;
  onMinuteDone: () => void;
}

/** The clock face. Tap or drag anywhere to move the hand; arrow keys work too. Always clockwise (LTR), even in Arabic. */
function Dial({ view, hour, minute, minuteStep, label, onHour, onMinute, onHourDone, onMinuteDone }: DialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const labels = view === "hours" ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 12 }, (_, i) => i * 5);
  const angle = view === "hours" ? (hour % 12) * 30 : minute * 6;

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    let deg = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    if (view === "hours") onHour(Math.round(deg / 30) % 12 || 12);
    else onMinute((Math.round(deg / (6 * minuteStep)) * minuteStep) % 60);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
    if (delta) {
      e.preventDefault();
      if (view === "hours") onHour((((hour - 1 + delta) % 12) + 12) % 12 + 1);
      else onMinute((((minute + delta * minuteStep) % 60) + 60) % 60);
    } else if (e.key === "Enter") {
      e.preventDefault();
      (view === "hours" ? onHourDone : onMinuteDone)();
    }
  };

  return (
    <div
      ref={ref}
      dir="ltr"
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={view === "hours" ? 1 : 0}
      aria-valuemax={view === "hours" ? 12 : 59}
      aria-valuenow={view === "hours" ? hour : minute}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        fromPointer(e);
      }}
      onPointerMove={(e) => dragging && fromPointer(e)}
      onPointerUp={() => {
        if (!dragging) return;
        setDragging(false);
        if (view === "hours") onHourDone();
      }}
      onPointerCancel={() => setDragging(false)}
      style={{ width: SIZE, height: SIZE }}
      className="relative mx-auto my-4 cursor-pointer touch-none rounded-full bg-field select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      {/* Hand + knob */}
      <div
        className={cn("absolute bottom-1/2 left-1/2 w-0.5 -translate-x-1/2 origin-bottom rounded-full bg-primary", !dragging && "transition-transform duration-300 ease-out")}
        style={{ height: RADIUS, rotate: `${angle}deg` }}
      >
        <span className="absolute -top-5 left-1/2 size-10 -translate-x-1/2 rounded-full bg-primary shadow-[0_6px_14px_-4px_rgb(118_196_25_/_0.8)]" />
      </div>
      <span className="absolute top-1/2 left-1/2 size-2.5 -translate-1/2 rounded-full bg-primary" />

      {/* Numbers */}
      <div key={view} className="absolute inset-0 animate-pop-in">
        {labels.map((n, i) => {
          const a = (i + (view === "hours" ? 1 : 0)) * 30 * (Math.PI / 180);
          const selected = view === "hours" ? n === hour : n === minute;
          return (
            <span
              key={n}
              aria-hidden
              className={cn(
                "pointer-events-none absolute grid size-10 -translate-1/2 place-items-center rounded-full text-sm tabular-nums transition-colors duration-200",
                selected ? "font-bold text-white" : "text-ink",
              )}
              style={{ left: SIZE / 2 + RADIUS * Math.sin(a), top: SIZE / 2 - RADIUS * Math.cos(a) }}
            >
              {view === "hours" ? n : pad(n)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
