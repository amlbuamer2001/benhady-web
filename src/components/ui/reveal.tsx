"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";

const offsets = {
  up: { y: 28 },
  start: { x: "var(--slide-from-start)" },
  end: { x: "var(--slide-from-end)" },
  zoom: { scale: 0.9 },
} as const;

interface RevealProps {
  children: ReactNode;
  from?: keyof typeof offsets;
  delay?: number;
  className?: string;
}

/**
 * Fades its (server-rendered) children in when scrolled into view.
 * Lets static content stay in Server Components while still animating.
 */
export function Reveal({ children, from = "up", delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay }}
    >
      {children}
    </motion.div>
  );
}
