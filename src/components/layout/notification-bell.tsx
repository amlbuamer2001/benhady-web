"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { BellIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/site";

/** Bell that rings on hover/tap, with a pulsing unread badge. */
export function NotificationBell({ count = 0 }: { count?: number }) {
  const t = useTranslations("nav");
  return (
    <motion.div whileHover="ring" whileTap="ring" className="relative">
      <Link
        href={routes.notifications}
        aria-label={t("notifications")}
        className="grid size-10 place-items-center rounded-full transition-colors hover:bg-primary-100"
      >
        <motion.span
          className="block origin-top"
          variants={{ ring: { rotate: [0, -18, 16, -12, 8, -4, 0] } }}
          transition={{ duration: 0.7 }}
        >
          <BellIcon />
        </motion.span>
      </Link>
      {count > 0 && (
        <motion.span
          aria-hidden
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-0.5 end-0.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-white"
        >
          {count > 9 ? "9+" : count}
        </motion.span>
      )}
    </motion.div>
  );
}
