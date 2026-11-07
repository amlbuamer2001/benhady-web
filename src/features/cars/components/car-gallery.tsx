"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Keyboard, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { localeDirection, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

function Arrow({ className, label, flip }: { className: string; label: string; flip?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      className={cn(className, "grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition-colors hover:bg-primary hover:text-white disabled:opacity-40")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={flip ? "ltr:-scale-x-100" : "rtl:-scale-x-100"}>
        <path d="m15 6-6 6 6 6" />
      </svg>
    </motion.button>
  );
}

/** Main photo slider with arrows + a thumbnails strip that follows (and drives) it. */
export function CarGallery({ images, alt }: { images: string[]; alt: string }) {
  const t = useTranslations("carDetails");
  const locale = useLocale() as Locale;
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);
  const [active, setActive] = useState(0);
  const multiple = images.length > 1;

  return (
    <section aria-label={t("gallery")} className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className="relative overflow-hidden rounded-3xl bg-field"
      >
        <Swiper
          key={locale}
          dir={localeDirection[locale]}
          modules={[Navigation, Thumbs, Keyboard, A11y]}
          navigation={{ prevEl: ".gallery-prev", nextEl: ".gallery-next" }}
          thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
          keyboard={{ enabled: true }}
          onSlideChange={(s) => setActive(s.activeIndex)}
          grabCursor={multiple}
          className="aspect-[16/10] sm:aspect-[16/9]"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`${src}-${i}`}>
              <div className="relative size-full">
                <Image
                  src={src}
                  alt={`${alt} – ${t("imageOf", { n: i + 1, total: images.length })}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {multiple && (
          <>
            <div className="absolute bottom-4 end-4 z-10 flex gap-2">
              <Arrow className="gallery-prev" label={t("prevImage")} />
              <Arrow className="gallery-next" label={t("nextImage")} flip />
            </div>
            <span dir="ltr" className="absolute bottom-4 start-4 z-10 rounded-full bg-ink/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </motion.div>

      {multiple && (
        <Swiper
          key={`thumbs-${locale}`}
          dir={localeDirection[locale]}
          modules={[Thumbs]}
          onSwiper={setThumbs}
          watchSlidesProgress
          spaceBetween={10}
          slidesPerView={3.4}
          breakpoints={{ 640: { slidesPerView: 4.4 }, 1024: { slidesPerView: 5 } }}
          className="w-full"
        >
          {images.map((src, i) => (
            <SwiperSlide key={`thumb-${src}-${i}`}>
              <motion.div
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                aria-label={t("showImage", { n: i + 1 })}
                aria-current={active === i || undefined}
                className={cn(
                  "relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border-2 transition-[border-color,opacity]",
                  active === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="(min-width: 1024px) 190px, 28vw" className="object-cover" />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
