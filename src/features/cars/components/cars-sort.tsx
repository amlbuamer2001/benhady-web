"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useId } from "react";
import { Select } from "@/components/ui/select";
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
      <Select
        id={id}
        value={current}
        onChange={change}
        clearable
        placeholder={t("sortDefault")}
        options={sortOptions.map((o) => ({ value: o.key, label: t(`sortOptions.${o.key}`) }))}
        className="h-10 w-auto min-w-40 gap-2 bg-white ps-4 pe-3 text-xs font-bold data-placeholder:text-ink"
      />
    </motion.div>
  );
}
