"use client";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CalendarIcon, ChevronDownIcon, CloseIcon, SearchIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { carFilterKeys, nonFilterKeys, type CarFilterOptions, type CarFilters as Filters, type FilterOption } from "../types";
import { useCarsNav } from "./cars-shell";

const fieldClass =
  "h-11 w-full rounded-full border border-line bg-field px-4 text-sm outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-primary/40";

function Field({ label, children }: { label: string; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <motion.div className="flex flex-col gap-2" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
      <label htmlFor={id} className="text-xs font-bold">
        {label}
      </label>
      {children(id)}
    </motion.div>
  );
}

function Select({ id, value, onChange, options, placeholder }: { id: string; value?: string; onChange: (v: string) => void; options: FilterOption[]; placeholder: string }) {
  return (
    <div className="relative">
      <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cn(fieldClass, "cursor-pointer appearance-none pe-10", !value && "text-muted")}>
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id} className="text-ink">
            {o.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}

function WithIcon({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
    </div>
  );
}

/** Runs `apply` 400ms after the last keystroke, only when the text differs from what the URL already has. */
function useLiveSearch(search: string, current: string | undefined, apply: (search: string) => void) {
  useEffect(() => {
    if (search.trim() === (current ?? "")) return;
    const id = setTimeout(() => apply(search.trim()), 400);
    return () => clearTimeout(id);
    // Only the search text should restart the timer.
  }, [search]);
}

const Spinner = () => <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;

/** The filter form itself, shared by the desktop sidebar and the phone bottom sheet. */
function FiltersForm({ options, initial, onDone, showSearch = true }: { options: CarFilterOptions; initial: Filters; onDone?: () => void; showSearch?: boolean }) {
  const t = useTranslations("carsPage");
  const { go, pending } = useCarsNav();
  const [values, setValues] = useState<Filters>(initial);
  const set = (key: keyof Filters) => (v: string) => setValues((s) => ({ ...s, [key]: v }));
  const searchRef = useRef<HTMLInputElement>(null);
  const search = values.search ?? "";

  // Keep the form in sync when the URL changes (back/forward, reset) — but never
  // overwrite letters typed while a live-search request was in flight.
  useEffect(() => {
    const typing = document.activeElement === searchRef.current;
    setValues((s) => (typing ? { ...initial, search: s.search } : initial));
  }, [initial]);

  useLiveSearch(search, initial.search, (s) => go({ ...values, search: s }, { scroll: false }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    go(values);
    onDone?.();
  };
  const reset = () => {
    setValues({});
    go({});
    onDone?.();
  };

  return (
    <motion.form onSubmit={submit} initial="hidden" animate="show" transition={{ staggerChildren: 0.04 }} className="flex flex-col gap-4">
      {showSearch && (
      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
        <input
          ref={searchRef}
          type="search"
          enterKeyHint="search"
          aria-label={t("searchLabel")}
          value={search}
          onChange={(e) => set("search")(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className={cn(fieldClass, "flex-1")}
        />
        <motion.button
          type="submit"
          aria-label={t("searchLabel")}
          whileHover={{ scale: 1.08, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white"
        >
          {pending ? <Spinner /> : <SearchIcon />}
        </motion.button>
      </motion.div>
      )}

      <Field label={t("city")}>{(id) => <Select id={id} value={values.city_id} onChange={set("city_id")} options={options.cities} placeholder={t("choose")} />}</Field>
      {options.categories.length > 0 && (
        <Field label={t("category")}>
          {(id) => <Select id={id} value={values.category_id} onChange={set("category_id")} options={options.categories} placeholder={t("category")} />}
        </Field>
      )}
      <Field label={t("pickupDate")}>
        {(id) => (
          <WithIcon icon={<CalendarIcon />}>
            <input id={id} type="date" value={values.pickup_date ?? ""} onChange={(e) => set("pickup_date")(e.target.value)} className={cn(fieldClass, "pe-11")} />
          </WithIcon>
        )}
      </Field>
      <Field label={t("returnDate")}>
        {(id) => (
          <WithIcon icon={<CalendarIcon />}>
            <input
              id={id}
              type="date"
              min={values.pickup_date || undefined}
              value={values.return_date ?? ""}
              onChange={(e) => set("return_date")(e.target.value)}
              className={cn(fieldClass, "pe-11")}
            />
          </WithIcon>
        )}
      </Field>
      <Field label={t("brand")}>{(id) => <Select id={id} value={values.brand_id} onChange={set("brand_id")} options={options.brands} placeholder={t("brand")} />}</Field>
      <Field label={t("transmission")}>
        {(id) => <Select id={id} value={values.transmission_id} onChange={set("transmission_id")} options={options.transmissions} placeholder={t("transmission")} />}
      </Field>
      <Field label={t("fuel")}>{(id) => <Select id={id} value={values.fuel_type_id} onChange={set("fuel_type_id")} options={options.fuelTypes} placeholder={t("fuel")} />}</Field>
      <Field label={t("year")}>{(id) => <Select id={id} value={values.model_year_id} onChange={set("model_year_id")} options={options.years} placeholder={t("year")} />}</Field>
      <Field label={t("seats")}>
        {(id) => (
          <WithIcon icon={<UserIcon width={18} height={18} />}>
            <input
              id={id}
              type="number"
              inputMode="numeric"
              min={1}
              max={15}
              value={values.seats ?? ""}
              onChange={(e) => set("seats")(e.target.value)}
              placeholder={t("seats")}
              className={cn(fieldClass, "pe-11")}
            />
          </WithIcon>
        )}
      </Field>
      <motion.fieldset variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="flex flex-col gap-2">
        <legend className="mb-2 text-xs font-bold">{t("price")}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["min_price", "max_price"] as const).map((key) => (
            <div key={key} className="relative">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={10}
                aria-label={`${t("price")} – ${t(key === "min_price" ? "priceMin" : "priceMax")}`}
                value={values[key] ?? ""}
                onChange={(e) => set(key)(e.target.value)}
                placeholder={t(key === "min_price" ? "priceMin" : "priceMax")}
                className={cn(fieldClass, "pe-9")}
              />
              <Image src="/icons/KsaSymbol.svg" alt="" width={11} height={13} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 opacity-60" />
            </div>
          ))}
        </div>
      </motion.fieldset>

      <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-2 flex flex-col items-center gap-3">
        <motion.button
          type="submit"
          disabled={pending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-70"
        >
          {pending && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
          {t("submit")}
        </motion.button>
        <motion.button type="button" onClick={reset} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm text-danger">
          {t("reset")}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}

/** Phones/tablets: live search box with the filter icon beside it (opens the sheet). */
function MobileSearchBar({ initial, active, onOpenFilters }: { initial: Filters; active: number; onOpenFilters: () => void }) {
  const t = useTranslations("carsPage");
  const { go, pending } = useCarsNav();
  const [search, setSearch] = useState(initial.search ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Follow the URL (reset, back/forward) unless the user is mid-typing.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setSearch(initial.search ?? "");
  }, [initial.search]);

  useLiveSearch(search, initial.search, (s) => go({ ...initial, search: s }, { scroll: false }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur(); // closes the phone keyboard
    go({ ...initial, search: search.trim() }, { scroll: false });
  };

  return (
    <motion.form
      onSubmit={submit}
      role="search"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 lg:hidden"
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted">{pending ? <Spinner /> : <SearchIcon />}</span>
        <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          aria-label={t("searchLabel")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-12 w-full rounded-2xl border border-line bg-white ps-11 pe-4 text-sm shadow-[0_6px_20px_-12px_rgb(0_0_0_/_0.2)] outline-none transition-shadow placeholder:text-muted focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <motion.button
        type="button"
        onClick={onOpenFilters}
        aria-label={active > 0 ? `${t("filters")} – ${t("activeFilters", { count: active })}` : t("filters")}
        aria-haspopup="dialog"
        whileTap={{ scale: 0.9, rotate: -8 }}
        className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-[0_8px_20px_-8px_rgb(118_196_25_/_0.7)]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
        <AnimatePresence>
          {active > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              aria-hidden
              className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full border-2 border-white bg-ink text-[10px] font-bold text-white"
            >
              {active}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.form>
  );
}

/**
 * Desktop: sticky sidebar. Phones/tablets: a live search box with a filter icon
 * beside it that opens the rest of the form in a bottom sheet (drag down to close).
 */
export function CarFilters({ options, initial }: { options: CarFilterOptions; initial: Filters }) {
  const t = useTranslations("carsPage");
  const [open, setOpen] = useState(false);
  const active = carFilterKeys.filter((k) => !nonFilterKeys.includes(k) && initial[k]).length;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) setOpen(false);
  };

  return (
    <>
      <motion.aside
        aria-label={t("filtersTitle")}
        initial={{ opacity: 0, x: "var(--slide-from-start)" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
        className="sticky top-24 hidden self-start rounded-3xl bg-white p-5 shadow-[0_10px_40px_-16px_rgb(0_0_0_/_0.18)] lg:block"
      >
        <FiltersForm options={options} initial={initial} />
      </motion.aside>

      <MobileSearchBar initial={initial} active={active} onOpenFilters={() => setOpen(true)} />

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={t("filtersTitle")}>
            <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div
              className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-[1.75rem] bg-white pb-[env(safe-area-inset-bottom)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={onDragEnd}
            >
              <div className="flex items-center justify-between px-5 pb-2 pt-3">
                <span aria-hidden className="w-9" />
                <span aria-hidden className="h-1.5 w-12 rounded-full bg-line" />
                <button type="button" aria-label={t("close")} onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full bg-field">
                  <CloseIcon width={16} height={16} />
                </button>
              </div>
              <h2 className="px-5 pb-3 text-lg font-bold">{t("filtersTitle")}</h2>
              <div className="overflow-y-auto overscroll-contain px-5 pb-6">
                {/* The search box lives in the bar above the results on phones, so it isn't repeated here. */}
                <FiltersForm options={options} initial={initial} onDone={() => setOpen(false)} showSearch={false} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
