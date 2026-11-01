"use client";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { A11y, Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { SliderNav, sliderNavigation } from "@/components/ui/slider-nav";
import { localeDirection, type Locale } from "@/i18n/routing";
import { fleetCars } from "../data/cars";
import { CarCard } from "./car-card";
import { SectionHeader } from "./section-header";

export function FleetSlider() {
  const t = useTranslations("home.fleet");
  const locale = useLocale() as Locale;

  return (
    <section className="overflow-hidden bg-gradient-to-b from-white via-primary-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeader title={t("title")}>
          <SliderNav name="fleet" />
        </SectionHeader>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <Swiper
            key={locale} // direction can't change after init
            dir={localeDirection[locale]}
            modules={[Navigation, Autoplay, A11y]}
            navigation={sliderNavigation("fleet")}
            autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            grabCursor
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.4 }, 1280: { slidesPerView: 4.4 } }}
            className="!overflow-visible !py-4 [&_.swiper-slide]:h-auto"
          >
            {fleetCars.map((car) => (
              <SwiperSlide key={car.id}>
                <CarCard car={car} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
