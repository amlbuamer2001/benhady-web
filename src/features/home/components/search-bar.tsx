"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState, type FormEvent, type ReactNode } from "react";
import { CalendarIcon, ClockIcon, PinIcon, SearchIcon } from "@/components/icons";
import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { ClockPicker } from "@/components/ui/clock-picker";
import { startOfDay } from "@/lib/date";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/config/site";
import type { FilterOption } from "@/features/cars/types";

interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

/** Labelled field whose icon wiggles when it is hovered, focused or tapped. */
function SearchField({ id, label, children }: FieldProps) {
  return (
    <motion.div className="flex min-w-0 flex-1 flex-col gap-2" whileHover="active" whileFocus="active" whileTap="active">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      {children}
    </motion.div>
  );
}

function WiggleIcon({ children }: { children: ReactNode }) {
  return (
    <motion.span className="flex" variants={{ active: { rotate: [0, -15, 15, -8, 0], scale: 1.15 } }} transition={{ duration: 0.5 }}>
      {children}
    </motion.span>
  );
}

export function SearchBar({ cities }: { cities: FilterOption[] }) {
  const t = useTranslations("home.search");
  const router = useRouter();
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Param names match the cars page filters (and the backend). Time isn't a filter yet, but is kept for the booking step.
    const query = Object.fromEntries(Object.entries({ city_id: city, pickup_date: date, pickup_time: time }).filter(([, v]) => v));
    router.push({ pathname: routes.cars, query });
  };

  return (
    <motion.section
      aria-label={t("label")}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-8"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
        <SearchField id="search-city" label={t("city")}>
          <Select
            id="search-city"
            value={city}
            onChange={setCity}
            clearable
            placeholder={t("cityPlaceholder")}
            options={cities.map((c) => ({ value: String(c.id), label: c.name }))}
            icon={<WiggleIcon><PinIcon /></WiggleIcon>}
          />
        </SearchField>
        <SearchField id="search-date" label={t("date")}>
          <DatePicker
            id="search-date"
            value={date}
            onChange={setDate}
            minDate={startOfDay()}
            placeholder={t("datePlaceholder")}
            icon={<WiggleIcon><CalendarIcon /></WiggleIcon>}
          />
        </SearchField>
        <SearchField id="search-time" label={t("time")}>
          <ClockPicker
            id="search-time"
            value={time}
            onChange={setTime}
            placeholder={t("timePlaceholder")}
            icon={<WiggleIcon><ClockIcon /></WiggleIcon>}
          />
        </SearchField>
        <motion.button
          type="submit"
          whileHover="hover"
          whileTap={{ scale: 0.94 }}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-white transition-colors hover:bg-primary-hover md:w-36"
        >
          <motion.span variants={{ hover: { rotate: [0, 20, -10, 0], scale: 1.2 } }} transition={{ duration: 0.45 }}>
            <SearchIcon />
          </motion.span>
          {t("submit")}
        </motion.button>
      </form>
    </motion.section>
  );
}
