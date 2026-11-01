"use client";
import { motion, useAnimate, useInView } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

export function About() {
  const t = useTranslations("home.about");

  return (
    <section aria-labelledby="about-title" className="grid overflow-hidden md:grid-cols-[1fr_2fr]">
      <motion.div
        initial={{ opacity: 0, x: "var(--slide-from-start)" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
        className="flex flex-col items-center justify-center gap-4 bg-primary px-6 py-12 text-center text-white"
      >
        <h2 id="about-title" className="text-2xl font-bold">
          {t("title")}
        </h2>
        <p className="text-xl">{t("subtitle")}</p>
        <motion.div
          whileHover={{ rotate: [0, -6, 6, -3, 0], scale: 1.08 }}
          whileTap={{ rotate: [0, -6, 6, -3, 0], scale: 1.08 }}
          transition={{ duration: 0.6 }}
          className="mt-2 rounded-2xl bg-white/95 p-3 shadow-lg"
        >
          <Image src="/images/logo.svg" alt="" width={144} height={80} className="h-20 w-auto" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: "var(--slide-from-end)" }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.15 }}
        className="flex flex-col items-center justify-center gap-4 bg-primary-200 px-6 py-12 text-center sm:px-12"
      >
        <p className="max-w-2xl text-sm leading-7">{t("body")}</p>
        <Signature label={t("signature")} />
        <div>
          <p className="text-sm font-bold">{t("ceoName")}</p>
          <p className="mt-1 text-xs text-muted">{t("ceoRole")}</p>
        </div>
      </motion.div>
    </section>
  );
}

/** Signature revealed left-to-right like handwriting when it scrolls into view; hovering writes it again. */
function Signature({ label }: { label: string }) {
  // In-view is tracked on the unclipped wrapper: a fully clip-pathed element never counts as visible.
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper, { once: true, amount: 0.8 });
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const write = () => animate(scope.current, { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"] }, { duration: 1.8, ease: "easeInOut" });

  useEffect(() => {
    if (inView) write();
  }, [inView]);

  return (
    <motion.div ref={wrapper} dir="ltr" onHoverStart={write} onTap={write}>
      <div ref={scope} style={{ clipPath: "inset(0 100% 0 0)" }}>
        <Image src="/icons/signature.svg" alt={label} width={144} height={42} className="h-auto w-36" />
      </div>
    </motion.div>
  );
}
