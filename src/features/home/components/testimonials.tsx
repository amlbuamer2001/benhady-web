"use client";
import { motion } from "motion/react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SliderNav, sliderNavigation } from "@/components/ui/slider-nav";
import { localeDirection, type Locale } from "@/i18n/routing";
import { SectionHeader } from "./section-header";

interface Testimonial {
  name: string;
  date: string;
  text: string;
  rating: number;
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span role="img" aria-label={label} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <motion.svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className={i < rating ? "text-amber-400" : "text-line"}
          variants={{ hover: { scale: [1, 1.4, 1], rotate: [0, 72, 0], transition: { delay: i * 0.06, duration: 0.45 } } }}
        >
          <path fill="currentColor" d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
        </motion.svg>
      ))}
    </span>
  );
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const locale = useLocale() as Locale;
  // Arrays aren't reachable through t(), so read the list from the raw messages.
  const items = (useMessages() as { home: { testimonials: { items: Testimonial[] } } }).home.testimonials.items;

  return (
    <section className="overflow-hidden bg-primary-50 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeader title={t("title")}>
          <SliderNav name="reviews" />
        </SectionHeader>

        <Swiper
          key={locale}
          dir={localeDirection[locale]}
          modules={[Navigation, Autoplay, A11y]}
          navigation={sliderNavigation("reviews")}
          autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          rewind // too few slides for loop mode at wide breakpoints
          grabCursor
          spaceBetween={20}
          slidesPerView={1.1}
          breakpoints={{ 768: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}
          className="!overflow-visible !py-4 [&_.swiper-slide]:h-auto"
        >
          {items.map((item, i) => (
            <SwiperSlide key={item.name}>
              <motion.figure
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover="hover"
                whileTap="hover"
                variants={{ hover: { y: -6, rotate: i % 2 ? 1 : -1 } }}
                className="flex h-52 flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_4px_24px_-10px_rgb(0_0_0_/_0.15)] transition-shadow hover:shadow-[0_18px_40px_-14px_rgb(118_196_25_/_0.5)]"
              >
                <figcaption className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">{item.date}</p>
                  </div>
                  <span className="shrink-0"><Stars rating={item.rating} label={t("rating", { rating: item.rating })} /></span>
                </figcaption>
                <blockquote title={item.text} className="line-clamp-4 text-sm leading-6">{item.text}</blockquote>
              </motion.figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
