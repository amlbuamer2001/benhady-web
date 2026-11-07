"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { sortOptions, type CarFilters } from "../types";
import { useCarsNav } from "./cars-shell";

/** Sort select next to the results count; maps one choice to the backend's `sort_by` + `sort_order`. */
export function CarsSort({ filters }: { filters: CarFilters }) {
  const t = useTranslations("carsPage");
  const { go } = useCarsNav();
  const id = useId();
  const current = sortOptions.find((o) => o.sort_by === filters.sort_by && o.sort_order === filters.sort_order)?.key ?? "";

  const change = (key: string) => {
    const option = sortOptions.find((o) => o.key === key);
    // Changing the order starts again from page 1 (no `page` in the params).
    go({ ...filters, sort_by: option?.sort_by, sort_order: option?.sort_order }, { scroll: false });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
      <label htmlFor={id} className="shrink-0 text-xs font-bold text-ink/75">
        {t("sort")}
      </label>
      <div className="relative">
        <select
          id={id}
          value={current}
          onChange={(e) => change(e.target.value)}
          className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-white pe-9 ps-4 text-xs font-bold outline-none transition-shadow focus:ring-2 focus:ring-primary/40"
        >
          <option value="">{t("sortDefault")}</option>
          {sortOptions.map((o) => (
            <option key={o.key} value={o.key}>
              {t(`sortOptions.${o.key}`)}
            </option>
          ))}
        </select>
        <ChevronDownIcon width={14} height={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </motion.div>
  );
}
