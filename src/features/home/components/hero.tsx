"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { ArrowIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/site";

const MotionLink = motion.create(Link);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
} as const;

function Sparkle({ className, size, delay = 0 }: { className: string; size: number; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={className}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: [1, 1.15, 1], rotate: [0, 90, 180] }}
      transition={{
        opacity: { delay },
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 6, repeat: Infinity, ease: "linear", delay },
      }}
      whileHover={{ scale: 1.4, rotate: 360 }}
    >
      <Image src="/icons/decorationPortal.svg" alt="" width={size} height={size} />
    </motion.div>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const carsY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-primary-100 via-primary-50 to-white">
      <Sparkle className="absolute start-[6%] top-[18%] hidden sm:block" size={36} />
      <Sparkle className="absolute end-[4%] top-[3%] w-8 sm:end-[6%] sm:top-[38%] sm:w-auto" size={48} delay={0.6} />

      <motion.div
        className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 pt-14 text-center sm:px-8 sm:pt-20"
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.12 }}
      >
        <motion.h1 variants={fadeUp} className="text-3xl font-bold text-primary sm:text-5xl">
          {t("title")}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-base font-medium sm:text-lg">
          {t("subtitle")}
        </motion.p>
        <motion.p variants={fadeUp} className="max-w-md text-xs leading-6 text-muted sm:text-sm">
          {t("description")}
        </motion.p>
        <MotionLink
          href={routes.cars}
          variants={fadeUp}
          whileHover={{ scale: 1.04, boxShadow: "0 12px 30px -10px rgb(118 196 25 / 0.7)" }}
          whileTap={{ scale: 0.96 }}
          className="group mt-3 inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-white"
        >
          {t("cta")}
          <ArrowIcon className="transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
        </MotionLink>
      </motion.div>

      <motion.div
        style={{ y: carsY }}
        // Cars start small, hazy and near the horizon, then drive up to full size.
        initial={{ opacity: 0, scale: 0.3, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{
          scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
          opacity: { duration: 0.6, delay: 0.3 },
          filter: { duration: 1.2, delay: 0.3 },
        }}
        className="relative mx-auto mt-6 max-w-6xl origin-[50%_35%] px-4"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.02 }}
        >
          <Image
            src="/images/car-hero.png"
            alt={t("carsAlt")}
            width={3440}
            height={948}
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="h-auto w-full drop-shadow-[0_30px_25px_rgb(0_0_0_/_0.15)]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
