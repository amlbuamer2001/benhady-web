"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { Link, useRouter } from "@/i18n/navigation";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { routes } from "@/config/site";

/** Avatar + name trigger with an animated dropdown (profile, bookings, contracts, wallet, logout). */
export function UserMenu({ name }: { name: string }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const { mutate, isPending } = useLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = [
    { href: routes.profile, label: t("profile") },
    { href: routes.bookings, label: t("bookings") },
    { href: routes.contracts, label: t("contracts") },
    { href: routes.wallet, label: t("wallet") },
  ];

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        whileHover="hover"
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-3"
      >
        <motion.span
          variants={{ hover: { rotate: [0, -8, 8, -4, 0], scale: 1.06 } }}
          transition={{ duration: 0.5 }}
          className="relative block size-12 overflow-hidden rounded-full ring-2 ring-primary/30"
        >
          <Image src="/icons/avatar.svg" alt="" fill sizes="48px" unoptimized />
        </motion.span>
        <span className="text-sm font-bold">{name}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <ChevronDownIcon />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute end-0 top-full z-50 mt-3 w-52 origin-top overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-xl"
          >
            {items.map((item, i) => (
              <motion.div key={item.href} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * (i + 1) }}>
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-primary-100 hover:text-primary"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <motion.button
              type="button"
              role="menuitem"
              disabled={isPending}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * (items.length + 1) }}
              onClick={() =>
                mutate(undefined, {
                  onSettled: () => {
                    setOpen(false);
                    router.replace("/");
                    router.refresh();
                  },
                })
              }
              className="block w-full rounded-xl px-4 py-2.5 text-start text-sm text-danger transition-colors hover:bg-danger/10 disabled:opacity-60"
            >
              {t("logout")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
