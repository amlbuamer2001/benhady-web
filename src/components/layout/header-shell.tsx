"use client";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Sticky header behaviour: on phones it slides away while scrolling down and
 * returns on scroll up (like a native app bar); everywhere it gains a shadow
 * and compacts once the page is scrolled.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    const mobile = window.matchMedia("(max-width: 1023.98px)").matches;
    setHidden(mobile && y > prev && y > 140);
  });

  return (
    <motion.header
      data-scrolled={scrolled}
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group sticky top-0 z-40 bg-white/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-shadow duration-300",
        scrolled ? "shadow-[0_6px_24px_-12px_rgb(0_0_0_/_0.18)]" : "shadow-[0_1px_0_var(--color-line)]",
      )}
    >
      {children}
    </motion.header>
  );
}
