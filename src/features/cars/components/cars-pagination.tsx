"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { routes } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { CarFilters } from "../types";
import { useCarsNav } from "./cars-shell";

/** Up to 5 page numbers centred on the current page. */
function pageWindow(page: number, last: number): number[] {
  const start = Math.max(1, Math.min(page - 2, last - 4));
  return Array.from({ length: Math.min(5, last) }, (_, i) => start + i);
}

/**
 * Real links (crawlable, open-in-new-tab) that navigate through the shared
 * transition when clicked, so the grid shows its loading state.
 */
export function CarsPagination({ page, lastPage, filters }: { page: number; lastPage: number; filters: CarFilters }) {
  const t = useTranslations("carsPage");
  const { go } = useCarsNav();
  if (lastPage <= 1) return null;

  const href = (p: number) => ({ pathname: routes.cars, query: { ...filters, page: String(p) } });
  const onClick = (p: number) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    go({ ...filters, page: String(p) });
  };

  const arrow = (target: number, label: string, flip: boolean) => {
    const disabled = target < 1 || target > lastPage;
    const glyph = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={flip ? "ltr:-scale-x-100" : "rtl:-scale-x-100"}>
        <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />
      </svg>
    );
    return disabled ? (
      <span className="grid size-10 place-items-center text-line">{glyph}</span>
    ) : (
      <motion.span whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
        <Link href={href(target)} onClick={onClick(target)} aria-label={label} className="grid size-10 place-items-center rounded-lg text-ink hover:text-primary">
          {glyph}
        </Link>
      </motion.span>
    );
  };

  return (
    <nav aria-label={t("pagination")} className="mt-10 flex items-center justify-center gap-1 sm:gap-2">
      {arrow(page - 1, t("prev"), false)}
      {pageWindow(page, lastPage).map((p) => {
        const active = p === page;
        return (
          <motion.span key={p} whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }} className="relative">
            {active && (
              <motion.span layoutId="cars-page-pill" className="absolute inset-0 rounded-lg bg-primary" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <Link
              href={href(p)}
              onClick={onClick(p)}
              aria-label={t("page", { page: p })}
              aria-current={active ? "page" : undefined}
              className={cn("relative grid size-10 place-items-center rounded-lg text-sm font-bold transition-colors", active ? "text-white" : "text-ink hover:bg-primary-100")}
            >
              {p}
            </Link>
          </motion.span>
        );
      })}
      {arrow(page + 1, t("next"), true)}
    </nav>
  );
}
