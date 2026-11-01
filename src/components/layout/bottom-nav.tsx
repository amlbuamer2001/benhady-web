"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CarIcon, HomeIcon, TicketIcon, UserIcon } from "@/components/icons";
import { routes } from "@/config/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

interface TabVisualProps {
  icon: ReactNode;
  label: string;
  active: boolean;
}

/** Icon + label with the sliding pill and a little hop when the tab becomes active. */
function TabVisual({ icon, label, active }: TabVisualProps) {
  return (
    <>
      <span className="relative grid h-8 w-14 place-items-center">
        {active && (
          <motion.span
            layoutId="bottom-nav-pill"
            className="absolute inset-0 rounded-full bg-primary-100"
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          />
        )}
        <motion.span
          className="relative"
          animate={active ? { y: [0, -4, 0], scale: [1, 1.15, 1] } : { y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.span>
      </span>
      <span className={cn("text-[11px] leading-none", active ? "font-bold" : "font-medium")}>{label}</span>
    </>
  );
}

const tabClass = (active: boolean) =>
  cn("flex flex-1 flex-col items-center gap-1 py-2 transition-colors", active ? "text-primary" : "text-muted");

/** Button-style tab (used by the "More" sheet trigger). */
export function TabItem({ icon, label, active, ...rest }: TabVisualProps & Pick<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "aria-expanded" | "aria-haspopup">) {
  return (
    <motion.button type="button" whileTap={{ scale: 0.88 }} className={tabClass(active)} {...rest}>
      <TabVisual icon={icon} label={label} active={active} />
    </motion.button>
  );
}

const MotionLink = motion.create(Link);

/** App-style bottom tab bar for phones and tablets (< lg). */
export function BottomNav({ authed, children }: { authed: boolean; children: ReactNode }) {
  const t = useTranslations("nav.tabs");
  const pathname = usePathname();
  const account = authed ? routes.profile : routes.login;

  const tabs = [
    { key: "home", href: routes.home, icon: <HomeIcon /> },
    { key: "cars", href: routes.cars, icon: <CarIcon /> },
    { key: "bookings", href: routes.bookings, icon: <TicketIcon /> },
    { key: "account", href: account, icon: <UserIcon /> },
  ] as const;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav
      aria-label={t("home")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto flex max-w-xl items-stretch px-2">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <MotionLink
              key={tab.key}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              whileTap={{ scale: 0.88 }}
              className={tabClass(active)}
            >
              <TabVisual icon={tab.icon} label={t(tab.key)} active={active} />
            </MotionLink>
          );
        })}
        {children}
      </div>
    </nav>
  );
}
