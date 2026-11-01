"use client";
import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label: string;
  invalid?: boolean;
}

export function OtpInput({ value, onChange, length = 4, label, invalid }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusAt = (i: number) => refs.current[Math.min(Math.max(i, 0), length - 1)]?.focus();

  const setDigit = (i: number, digit: string) => {
    const next = digits.slice();
    next[i] = digit;
    onChange(next.join("").slice(0, length));
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i]) focusAt(i - 1);
    if (e.key === "ArrowLeft") focusAt(i - 1);
    if (e.key === "ArrowRight") focusAt(i + 1);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focusAt(pasted.length);
  };

  return (
    // Digits are always entered left-to-right, in both languages.
    <div dir="ltr" role="group" aria-label={label} className="flex justify-center gap-3 sm:gap-4">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`${label} ${i + 1}`}
          aria-invalid={invalid || undefined}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(-1);
            setDigit(i, d);
            if (d) focusAt(i + 1);
          }}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            "aspect-square w-full max-w-[76px] rounded-2xl border bg-primary-100 text-center text-3xl font-bold text-primary outline-none",
            "transition-shadow focus:ring-2 focus:ring-primary/60",
            invalid ? "border-danger" : "border-transparent",
          )}
        />
      ))}
    </div>
  );
}
