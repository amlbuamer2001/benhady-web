"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Green section title (start) with optional controls (end), revealed on scroll. */
export function SectionHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-6 flex items-center justify-between gap-4"
    >
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      {children}
    </motion.div>
  );
}
