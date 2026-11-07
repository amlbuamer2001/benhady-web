"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SliderNav, sliderNavigation } from "@/components/ui/slider-nav";
import { Link } from "@/i18n/navigation";
import { localeDirection, type Locale } from "@/i18n/routing";
import { routes } from "@/config/site";
import type { FleetCategory } from "../types";
import { SectionHeader } from "./section-header";

const MotionLink = motion.create(Link);

export function ExploreFleet({ categories }: { categories: FleetCategory[] }) {
  const t = useTranslations("home.explore");
  const locale = useLocale() as Locale;

  return (
    <section className="overflow-hidden py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeader title={t("title")}>
          <SliderNav name="explore" />
        </SectionHeader>

        <div className="edge-fade">
          <Swiper
            key={locale}
            dir={localeDirection[locale]}
            modules={[Navigation, Autoplay, A11y]}
            navigation={sliderNavigation("explore")}
            autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            rewind // too few slides for loop mode at wide breakpoints
            grabCursor
            spaceBetween={16}
            slidesPerView={2.3}
            breakpoints={{ 640: { slidesPerView: 3.5 }, 1024: { slidesPerView: 5.5 }, 1280: { slidesPerView: 6.5 } }}
            className="!overflow-visible !py-3"
          >
            {categories.map((c, i) => (
              <SwiperSlide key={c.id}>
                <MotionLink
                  href={{ pathname: routes.cars, query: { category_id: c.id } }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover="hover"
                  whileTap="hover"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-field px-3 py-5 text-center transition-colors hover:border-primary/40 hover:bg-primary-100"
                >
                  <motion.span
                    className="grid size-12 place-items-center"
                    variants={{ hover: { rotateY: 360, scale: 1.15, transition: { duration: 0.6 } } }}
                  >
                    {c.icon && <Image src={c.icon} alt="" width={40} height={40} className="h-10 w-auto" />}
                  </motion.span>
                  <span className="text-sm font-bold">{c.name}</span>
                </MotionLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
