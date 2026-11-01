"use client";
import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/cn";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: ReadonlyArray<Option<T>>;
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
  const group = useId();
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-full bg-field p-1.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative h-11 flex-1 rounded-full text-sm transition-colors",
              active ? "text-white" : "text-muted hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${group}`}
                className="absolute inset-0 rounded-full bg-primary shadow-[0_6px_14px_-4px_rgba(118,196,25,0.7)]"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
