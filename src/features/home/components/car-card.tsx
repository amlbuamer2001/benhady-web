"use client";
import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/site";
import type { FleetCar } from "../types";

const MotionLink = motion.create(Link);

/** Each spec icon gets its own hover motion: gear spins, fuel bounces, seat wiggles. */
const specMotion: Variants = {
  spin: { rotate: [0, 360], transition: { duration: 0.6 } },
  bounce: { y: [0, -5, 0, -3, 0], transition: { duration: 0.6 } },
  wiggle: { rotate: [0, -12, 12, -6, 0], transition: { duration: 0.5 } },
};

function Spec({ icon, label, effect }: { icon: string; label: string; effect: "spin" | "bounce" | "wiggle" }) {
  return (
    <motion.li className="flex min-w-0 items-center gap-1.5" whileHover={effect} whileTap={effect}>
      <motion.span variants={specMotion} className="inline-flex shrink-0">
        <Image src={icon} alt="" width={16} height={16} className="opacity-70" />
      </motion.span>
      <span className="truncate">{label}</span>
    </motion.li>
  );
}

export function CarCard({ car }: { car: FleetCar }) {
  const t = useTranslations("home.fleet");

  // The whole card is the link to the car's page.
  return (
    <MotionLink
      href={`${routes.cars}/${car.id}`}
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      variants={{ rest: { y: 0 }, hover: { y: -8 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group/card flex h-80 cursor-pointer flex-col gap-3 rounded-3xl bg-white p-3 text-ink focus-visible:outline-offset-4 shadow-[0_4px_24px_-8px_rgb(0_0_0_/_0.12)] transition-shadow hover:shadow-[0_18px_40px_-12px_rgb(118_196_25_/_0.45)]"
    >
      <div className="relative h-44 shrink-0 overflow-hidden rounded-2xl bg-ink">
        <motion.div className="absolute inset-0" variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }} transition={{ duration: 0.5 }}>
          <Image src={car.image} alt={car.name} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 85vw" className="object-cover" />
        </motion.div>
        <motion.span
          aria-hidden
          className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          variants={{ rest: { left: "-40%" }, hover: { left: "120%" } }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 px-1">
        <h3 title={car.name} className="truncate text-base font-bold">{car.name}</h3>
        {car.year && (
          <motion.span
            className="shrink-0 rounded-md bg-primary-100 px-2 py-0.5 text-xs font-bold text-primary"
            variants={{ rest: { scale: 1 }, hover: { scale: [1, 1.15, 1], transition: { duration: 0.4 } } }}
          >
            {car.year}
          </motion.span>
        )}
      </div>

      <ul className="flex items-center gap-4 overflow-hidden px-1 text-xs text-muted">
        <Spec icon="/icons/automatic.svg" label={car.transmission ?? t("automatic")} effect="spin" />
        <Spec icon="/icons/fuel.svg" label={car.fuel ?? t("fuel")} effect="bounce" />
        <Spec icon="/icons/seets.svg" label={t("seats", { count: car.seats })} effect="wiggle" />
      </ul>

      <div className="mt-auto flex items-center justify-between gap-2 px-1 pb-1">
        <p className="flex items-center gap-1">
          <span className="text-2xl font-bold">{car.pricePerDay}</span>
          <Image src="/icons/KsaSymbol.svg" alt={t("currency")} width={14} height={16} />
          <span className="text-xs text-muted">{t("perDay")}</span>
        </p>
        {/* Looks like a button; the card around it is the actual link. */}
        <motion.span
          aria-hidden
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-white transition-colors group-hover/card:bg-primary-hover"
        >
          {t("details")}
          <ArrowIcon width={14} height={14} className="transition-transform group-hover/card:translate-x-1 rtl:-scale-x-100 rtl:group-hover/card:-translate-x-1" />
        </motion.span>
      </div>
    </MotionLink>
  );
}
