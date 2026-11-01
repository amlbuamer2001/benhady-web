"use client";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import { GridIcon } from "@/components/icons";
import { usePathname } from "@/i18n/navigation";
import { TabItem } from "./bottom-nav";

/**
 * "More" tab of the bottom bar: opens a bottom sheet (drag down to dismiss).
 * Its content (user card, links, actions) is rendered by the server header.
 */
export function MobileMenu({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) setOpen(false);
  };

  return (
    <>
      <TabItem icon={<GridIcon />} label={t("tabs.more")} active={open} onClick={() => setOpen(true)} aria-expanded={open} aria-haspopup="dialog" />
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("menu")}>
            <motion.div
              className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[1.75rem] bg-white pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-12px_rgb(0_0_0_/_0.3)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={onDragEnd}
            >
              <div className="flex cursor-grab justify-center pb-2 pt-3 active:cursor-grabbing">
                <span aria-hidden className="h-1.5 w-12 rounded-full bg-line" />
              </div>
              <motion.div
                className="flex flex-col gap-5 overflow-y-auto overscroll-contain px-5"
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.05, delayChildren: 0.08 }}
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Staggered row inside the sheet. */
export function SheetItem({ children }: { children: ReactNode }) {
  return <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>{children}</motion.div>;
}
