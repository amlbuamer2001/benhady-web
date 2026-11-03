"use client";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { CountUp } from "./count-up";

interface Props {
  imageAlt: string;
  imageSmAlt: string;
  satisfactionLabel: string;
}

/** Large photo + overlapping small photo card with the satisfaction badge (light parallax between them). */
export function AboutGallery({ imageAlt, imageSmAlt, satisfactionLabel }: Props) {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smallY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[520px] pb-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 70, damping: 16 }}
        whileHover="hover"
        className="relative me-auto aspect-[4/5] w-[78%] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgb(0_0_0_/_0.45)]"
      >
        <motion.div className="absolute inset-0" variants={{ hover: { scale: 1.06 } }} transition={{ duration: 0.6 }}>
          <Image src="/images/about-lg.jpg" alt={imageAlt} fill sizes="(min-width: 1024px) 400px, 78vw" className="object-cover" priority />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: smallY }}
        initial={{ opacity: 0, x: "var(--slide-from-end)" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.25 }}
        whileHover={{ rotate: -2, scale: 1.03 }}
        className="absolute bottom-16 end-0 w-[46%] rounded-[1.75rem] bg-white p-3 shadow-[0_20px_50px_-20px_rgb(0_0_0_/_0.35)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
          <Image src="/images/about-sm.jpg" alt={imageSmAlt} fill sizes="(min-width: 1024px) 240px, 46vw" className="object-cover" />
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.6 }}
          whileHover={{ scale: 1.1, rotate: 8 }}
          className="absolute -bottom-6 -start-8 grid size-24 place-items-center rounded-full border-4 border-white bg-primary text-center text-white shadow-lg sm:size-28"
        >
          <div className="flex flex-col items-center leading-tight">
            <span className="text-2xl font-bold sm:text-3xl">
              <CountUp to={98} suffix={locale === "ar" ? "٪" : "%"} grouping={false} />
            </span>
            <span className="text-[10px] sm:text-xs">{satisfactionLabel}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
