"use client";
import { motion, type TargetAndTransition } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface HoverCardProps {
  icon: ReactNode;
  /** Icon motion on hover/tap (each card can wiggle, spin, bounce...). */
  iconEffect: TargetAndTransition;
  className?: string;
  iconClassName?: string;
  delay?: number;
  children: ReactNode;
}

/** Reveal-on-scroll card whose icon plays its own animation on hover or tap. */
export function HoverCard({ icon, iconEffect, className, iconClassName, delay = 0, children }: HoverCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 100, damping: 18, delay }}
      whileHover="hover"
      whileTap="hover"
      className={className}
    >
      <motion.span variants={{ hover: iconEffect }} className={cn("grid shrink-0 place-items-center", iconClassName)}>
        {icon}
      </motion.span>
      {children}
    </motion.div>
  );
}
