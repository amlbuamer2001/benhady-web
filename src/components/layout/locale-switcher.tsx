"use client";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { GlobeIcon } from "@/components/icons";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/** Switches language while staying on the same page. */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const next = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <motion.button
      type="button"
      lang={next}
      aria-label={t("changeLanguage")}
      whileHover="hover"
      whileTap={{ scale: 0.92 }}
      className={cn("flex items-center gap-1.5", className)}
      onClick={() => router.replace(pathname, { locale: next })}
    >
      <motion.span variants={{ hover: { rotate: 360 } }} transition={{ duration: 0.6, ease: "easeInOut" }}>
        <GlobeIcon />
      </motion.span>
      {t("language")}
    </motion.button>
  );
}
