"use client";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { ChevronDownIcon, PhoneIcon, PinIcon } from "@/components/icons";
import type { CarBranch } from "../types";

/** Collapsible list of branches holding the car, each with a map link (and a call link when there's a phone). */
export function CarBranches({ branches }: { branches: CarBranch[] }) {
  const t = useTranslations("carDetails");
  const separator = useLocale() === "ar" ? "، " : ", ";
  const [open, setOpen] = useState(true);
  const panelId = useId();

  return (
    <section className="overflow-hidden rounded-2xl border border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start text-sm font-bold transition-colors hover:bg-primary-50"
      >
        {t("branches")}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
          <ChevronDownIcon />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="divide-y divide-line border-t border-line"
          >
            {branches.map((b, i) => (
              <motion.li
                key={b.id}
                initial={{ opacity: 0, x: "var(--slide-from-start)" }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="flex min-w-0 items-start gap-2">
                  <motion.span whileHover={{ y: [0, -4, 0], transition: { duration: 0.4 } }} className="mt-0.5 shrink-0 text-primary">
                    <PinIcon width={18} height={18} />
                  </motion.span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{[b.city, b.name].filter(Boolean).join(separator)}</p>
                    {b.address && <p className="mt-0.5 text-xs text-muted">{b.address}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {b.phone && (
                    <motion.a
                      href={`tel:${b.phone.replace(/\s/g, "")}`}
                      aria-label={`${t("callBranch")} – ${b.name}`}
                      whileHover={{ rotate: [0, -15, 15, 0], transition: { duration: 0.4 } }}
                      whileTap={{ scale: 0.9 }}
                      className="grid size-8 place-items-center rounded-full bg-primary-100 text-primary"
                    >
                      <PhoneIcon width={15} height={15} />
                    </motion.a>
                  )}
                  {b.mapUrl && (
                    <motion.a
                      href={b.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-8 items-center gap-1.5 rounded-full bg-field px-3 text-xs font-bold transition-colors hover:bg-primary hover:text-white"
                    >
                      <PinIcon width={14} height={14} />
                      {t("viewLocation")}
                    </motion.a>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </section>
  );
}
