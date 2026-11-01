"use client";
import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type Props = ComponentProps<typeof Link>;

/** Nav link with a sliding underline: grows on hover, stays for the active page. */
export function NavLink({ href, className, children, ...rest }: Props) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : typeof href === "string" && pathname.startsWith(href);
  return (
    <motion.span className="relative inline-flex w-fit" initial="rest" whileHover="hover" animate={active ? "hover" : "rest"}>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn("py-1 transition-colors hover:text-primary", active ? "text-primary" : "text-ink", className)}
        {...rest}
      >
        <motion.span className="inline-block" variants={{ rest: { y: 0 }, hover: { y: -2 } }}>
          {children}
        </motion.span>
      </Link>
      <motion.span
        aria-hidden
        className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-center rounded-full bg-primary"
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </motion.span>
  );
}
