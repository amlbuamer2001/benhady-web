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
        className={cn("transition-colors hover:text-primary", active ? "text-primary" : "text-ink", className)}
        {...rest}
      >
        <motion.span className="inline-block">
          {children}
        </motion.span>
      </Link>
 
    </motion.span>
  );
}
