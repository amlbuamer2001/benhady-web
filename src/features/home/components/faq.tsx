"use client";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

const keys = ["types", "booking", "insurance", "branches", "nonSaudi", "payment"] as const;

export function Faq() {
  const t = useTranslations("home.faq");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-labelledby="faq-title" className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 text-center"
      >
        <h2 id="faq-title" className="text-2xl font-bold text-primary">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm">{t("subtitle")}</p>
      </motion.div>

      <ul className="flex flex-col gap-3">
        {keys.map((key, i) => {
          const isOpen = open === key;
          return (
            <motion.li
              key={key}
              initial={{ opacity: 0, x: "var(--slide-from-start)" }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 120, damping: 18 }}
              className={`overflow-hidden rounded-xl transition-colors ${isOpen ? "bg-primary-100" : "bg-field hover:bg-primary-50"}`}
            >
              <motion.button
                type="button"
                id={`faq-${key}`}
                aria-expanded={isOpen}
                aria-controls={`faq-${key}-panel`}
                onClick={() => setOpen(isOpen ? null : key)}
                whileHover="hover"
                whileTap={{ scale: 0.99 }}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-start text-sm font-bold"
              >
                <motion.span className="inline-block ltr:origin-left rtl:origin-right" variants={{ hover: { scale: 1.03 } }}>{t(`items.${key}.q`)}</motion.span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  // Springs only take two keyframes: the hover bounce gets its own tween.
                  variants={{ hover: { y: [0, 3, 0], transition: { duration: 0.4, ease: "easeInOut" } } }}
                  transition={{ rotate: { type: "spring", stiffness: 260, damping: 18 } }}
                  className={isOpen ? "text-primary" : "text-ink"}
                >
                  <ChevronDownIcon />
                </motion.span>
              </motion.button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-${key}-panel`}
                    role="region"
                    aria-labelledby={`faq-${key}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="px-5 pb-4 text-sm leading-7 text-muted">{t(`items.${key}.a`)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
