"use client";
import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/** Social icons rendered through a CSS mask so they can be tinted; each one flips around on hover. */
export function SocialLinks({ tone = "primary", className }: { tone?: "primary" | "ink"; className?: string }) {
  return (
    <ul className={cn("flex gap-3", className)}>
      {siteConfig.social.map((s, i) => (
        <motion.li
          key={s.name}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: i * 0.06 }}
        >
          <motion.a
            href={s.href}
            aria-label={s.label}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ rotateY: 360, scale: 1.15, y: -3 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "block size-8 transition-colors [mask-size:contain] [mask-repeat:no-repeat]",
              tone === "primary" ? "bg-primary hover:bg-primary-hover" : "bg-ink hover:bg-primary",
            )}
            style={{ maskImage: `url(${s.icon})`, WebkitMaskImage: `url(${s.icon})` }}
          />
        </motion.li>
      ))}
    </ul>
  );
}
