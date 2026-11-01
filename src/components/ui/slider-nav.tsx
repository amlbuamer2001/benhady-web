"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

function NavButton({ className, label, flip }: { className: string; label: string; flip?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.12, backgroundColor: "#76c419", color: "#ffffff", borderColor: "#76c419" }}
      whileTap={{ scale: 0.9 }}
      className={`${className} grid size-10 place-items-center rounded-full border border-ink bg-white text-ink disabled:opacity-40`}
    >
      {/* Arrows point "back" / "forward" relative to the reading direction. */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={flip ? "ltr:-scale-x-100" : "rtl:-scale-x-100"}>
        <path d="m15 6-6 6 6 6" />
      </svg>
    </motion.button>
  );
}

/** Prev/next buttons for a Swiper; pass the same `name` to the Swiper's navigation selectors. */
export function SliderNav({ name }: { name: string }) {
  const t = useTranslations("common");
  return (
    <div className="flex gap-3">
      <NavButton className={`${name}-prev`} label={t("previous")} />
      <NavButton className={`${name}-next`} label={t("next")} flip />
    </div>
  );
}

export const sliderNavigation = (name: string) => ({ prevEl: `.${name}-prev`, nextEl: `.${name}-next` });
