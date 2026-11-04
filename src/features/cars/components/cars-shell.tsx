"use client";
import { motion } from "motion/react";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import { routes } from "@/config/site";
import { useRouter } from "@/i18n/navigation";
import type { CarFilters } from "../types";

interface CarsNav {
  /** Navigate to /cars with these params (empty values are dropped); the server re-renders the results. */
  go: (params: CarFilters & { page?: string }, options?: { scroll?: boolean }) => void;
  pending: boolean;
}

const CarsNavContext = createContext<CarsNav | null>(null);

export function useCarsNav(): CarsNav {
  const ctx = useContext(CarsNavContext);
  if (!ctx) throw new Error("useCarsNav must be used inside <CarsShell>");
  return ctx;
}

/** Shares one transition between filters and pagination so the results can show a loading state. */
export function CarsShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const go: CarsNav["go"] = (params, { scroll = true } = {}) => {
    const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
    // Live search replaces the history entry instead of adding one per keystroke.
    startTransition(() => (scroll ? router.push : router.replace)({ pathname: routes.cars, query }, { scroll: false }));
    if (scroll) document.getElementById("cars-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <CarsNavContext.Provider value={{ go, pending }}>{children}</CarsNavContext.Provider>;
}

/** Wraps the server-rendered grid: dims it and shows a progress bar while new results load. */
export function CarsResults({ children }: { children: ReactNode }) {
  const { pending } = useCarsNav();
  return (
    <div id="cars-results" className="relative scroll-mt-28" aria-busy={pending}>
      {pending && (
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-3 h-1 rounded-full bg-primary ltr:origin-left rtl:origin-right"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 0.7, 0.9] }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      )}
      <div className={pending ? "pointer-events-none opacity-50 blur-[1px] transition" : "transition"}>{children}</div>
    </div>
  );
}
