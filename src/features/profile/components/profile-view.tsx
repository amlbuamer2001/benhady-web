"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { ChevronEndIcon, IdCardIcon, LockIcon, PhoneIcon, SteeringIcon, TrashIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Profile, ProfileTab } from "../types";
import { DeleteAccount } from "./delete-account";
import { BasicForm, IdentityForm, LicenseForm, PasswordForm, PhoneForm } from "./profile-forms";

const tabs: ProfileTab[] = ["basic", "phone", "license", "identity", "password", "delete"];

const icons: Record<ProfileTab, ReactNode> = {
  basic: <UserIcon width={18} height={18} />,
  phone: <PhoneIcon />,
  license: <SteeringIcon />,
  identity: <IdCardIcon />,
  password: <LockIcon />,
  delete: <TrashIcon />,
};

function VerifiedBadge({ active }: { active: boolean }) {
  const t = useTranslations("profile");
  return (
    <span className={cn("flex items-center gap-1 text-[11px] text-primary", active && "md:text-white/90")}>
      {t("verified")}
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        variants={{ hover: { scale: [1, 1.35, 1], rotate: [0, -12, 0] } }}
      >
        <motion.path d="m2 13 4 4 8-9" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
        <motion.path d="m10 17 1 1 10-11" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.55 }} />
      </motion.svg>
    </span>
  );
}

/**
 * Desktop: sidebar tabs + panel side by side.
 * Phones: an app-style settings list; picking a row "pushes" that section as its own screen with a back bar.
 * Both layouts share one panel so each form is mounted once.
 */
export function ProfileView({ profile, initialTab }: { profile: Profile; initialTab?: ProfileTab }) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const [tab, setTab] = useState<ProfileTab>(initialTab ?? "basic");
  // Only meaningful on phones: list screen vs. section screen. A ?tab= link opens the section directly.
  const [mobilePanel, setMobilePanel] = useState(!!initialTab);

  const label = (key: ProfileTab) =>
    key === "identity" ? t(`tabs.identity.${profile.identity_type ?? "resident_id"}`) : t(`tabs.${key}`);

  const verified: Partial<Record<ProfileTab, boolean>> = {
    phone: !!profile.phone,
    license: !!profile.driving_license_number,
    identity: !!(profile.id_number || profile.border_entry_number),
  };

  const open = (key: ProfileTab) => {
    setTab(key);
    setMobilePanel(true);
    if (window.matchMedia("(max-width: 767.98px)").matches) window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto grid max-w-4xl items-start gap-8 px-4 py-6 sm:px-8 md:grid-cols-[240px_1fr] md:py-16">
      <motion.nav
        aria-label={t("sections")}
        initial={{ opacity: 0, x: "var(--slide-from-start)" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className={cn("flex flex-col gap-4", mobilePanel && "hidden md:flex")}
      >
        {/* Phone-only identity card at the top of the settings list. */}
        <div className="flex items-center gap-4 rounded-3xl bg-gradient-to-l from-primary to-primary-hover p-4 text-white md:hidden">
          <span className="relative block size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/60">
            <Image src="/icons/avatar.svg" alt="" fill sizes="64px" unoptimized />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{profile.name}</p>
            {profile.email && (
              <p dir="ltr" className="truncate text-xs text-white/85 rtl:text-right">
                {profile.email}
              </p>
            )}
          </div>
        </div>

        <ul
          role="tablist"
          aria-orientation="vertical"
          className="flex flex-col divide-y divide-line overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-12px_rgb(0_0_0_/_0.15)] md:gap-1 md:divide-y-0 md:p-3"
        >
          {tabs.map((key, i) => {
            const active = tab === key;
            const danger = key === "delete";
            return (
              <motion.li key={key} role="presentation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <motion.button
                  type="button"
                  role="tab"
                  id={`tab-${key}`}
                  aria-selected={active}
                  aria-controls="profile-panel"
                  onClick={() => open(key)}
                  whileHover="hover"
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "relative flex min-h-14 w-full items-center gap-3 px-4 text-start text-sm font-bold transition-colors active:bg-primary-50",
                    "md:min-h-0 md:gap-2 md:rounded-full md:px-5 md:py-3 md:active:bg-transparent",
                    danger ? "text-danger" : "text-ink md:hover:text-primary",
                    active && "md:text-white md:hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="profile-tab-pill"
                      className={cn("absolute inset-0 hidden rounded-full md:block", danger ? "bg-danger" : "bg-primary")}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.span
                    variants={{ hover: { rotate: [0, -12, 12, 0] } }}
                    className={cn(
                      "relative grid size-9 shrink-0 place-items-center rounded-xl md:hidden",
                      danger ? "bg-danger/10" : "bg-primary-100 text-primary",
                    )}
                  >
                    {icons[key]}
                  </motion.span>
                  <motion.span className="relative flex-1 md:flex-none" variants={{ hover: { scale: active ? 1 : 1.05 } }}>
                    {label(key)}
                  </motion.span>
                  {verified[key] && (
                    <span className="relative">
                      <VerifiedBadge active={active} />
                    </span>
                  )}
                  <ChevronEndIcon className="relative text-muted md:hidden" />
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>

      <div id="profile-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className={cn(!mobilePanel && "hidden md:block")}>
        {/* Phone-only app bar for the open section. */}
        <div className="mb-6 flex items-center gap-3 md:hidden">
          <motion.button
            type="button"
            aria-label={tCommon("back")}
            onClick={() => setMobilePanel(false)}
            whileTap={{ scale: 0.88 }}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-100 text-primary"
          >
            {/* Chevron pointing "back" (toward the start edge). */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rtl:-scale-x-100">
              <path d="m15 6-6 6 6 6" />
            </svg>
          </motion.button>
          <h2 className={cn("text-lg font-bold", tab === "delete" && "text-danger")}>{label(tab)}</h2>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: "var(--slide-from-end)", filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.25 }}
          >
            {tab === "basic" && <BasicForm profile={profile} />}
            {tab === "phone" && <PhoneForm profile={profile} />}
            {tab === "license" && <LicenseForm profile={profile} />}
            {tab === "identity" && <IdentityForm profile={profile} />}
            {tab === "password" && <PasswordForm />}
            {tab === "delete" && <DeleteAccount />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
