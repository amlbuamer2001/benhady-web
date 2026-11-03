"use client";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BellIcon, CheckIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { NotificationItem } from "../types";

/** Notification cards with an unread marker and a "mark all as read" action. */
export function NotificationList({ items: initial }: { items: NotificationItem[] }) {
  const t = useTranslations("notifications");
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.read).length;

  // TODO: persist through the API once a "mark as read" endpoint is documented; this is local only.
  const markAllRead = () => setItems((list) => list.map((n) => ({ ...n, read: true })));

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 rounded-3xl bg-field px-6 py-16 text-center"
      >
        <motion.span
          animate={{ rotate: [0, -14, 12, -8, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 2.5 }}
          className="grid size-16 origin-top place-items-center rounded-full bg-primary-100 text-primary"
        >
          <BellIcon width={28} height={28} />
        </motion.span>
        <p className="text-base font-bold">{t("empty")}</p>
        <p className="text-sm text-muted">{t("emptyHint")}</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          {t("title")}
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                key="count"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="grid h-6 min-w-6 place-items-center rounded-full bg-primary px-2 text-xs text-white"
              >
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </h2>
        <motion.button
          type="button"
          onClick={markAllRead}
          disabled={unread === 0}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          className="flex h-10 items-center gap-2 rounded-xl border border-primary px-4 text-xs font-bold text-primary transition-colors enabled:hover:bg-primary enabled:hover:text-white disabled:cursor-default disabled:opacity-50"
        >
          <CheckIcon width={14} height={14} />
          {t("markAllRead")}
        </motion.button>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((n, i) => (
          <motion.li
            key={n.id}
            initial={{ opacity: 0, x: "var(--slide-from-start)" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "relative overflow-hidden rounded-2xl border px-5 py-4 transition-colors duration-500",
              n.read ? "border-line bg-field" : "border-primary/30 bg-primary-100",
            )}
          >
            {/* Unread marker on the start edge; slides away when read. */}
            <AnimatePresence>
              {!n.read && (
                <motion.span
                  aria-hidden
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  className="absolute inset-y-3 start-0 w-1 rounded-full bg-primary"
                />
              )}
            </AnimatePresence>
            <div className="flex items-start justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                {n.title}
                {!n.read && <span className="sr-only">({t("unread")})</span>}
              </h3>
              <time className="shrink-0 text-xs text-muted">{n.time}</time>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink/80">{n.body}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
