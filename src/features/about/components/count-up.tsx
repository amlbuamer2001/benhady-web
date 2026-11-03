"use client";
import { animate, useInView } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  /** "+" before the number, "%" after it, ... */
  prefix?: string;
  suffix?: string;
  /** Thousands separators (off for a year like 1400). */
  grouping?: boolean;
  duration?: number;
}

/**
 * Counts from 0 to `to` once it scrolls into view, in the locale's digits
 * (Arabic-Indic in Arabic). The final value is rendered on the server, so
 * crawlers and no-JS readers still see the real number.
 */
export function CountUp({ to, prefix = "", suffix = "", grouping = true, duration = 1.8 }: CountUpProps) {
  const locale = useLocale();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const format = (n: number) =>
    `${prefix}${new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en", { useGrouping: grouping }).format(Math.round(n))}${suffix}`;

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (node.textContent = format(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} dir="ltr">
      {format(to)}
    </span>
  );
}
