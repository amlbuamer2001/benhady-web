import type { TargetAndTransition } from "motion/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { cache } from "react";
import { CalendarIcon, CheckIcon, SearchIcon, ShieldIcon } from "@/components/icons";
import { PageHero } from "@/components/layout/page-hero";
import { buttonClasses } from "@/components/ui/button";
import { HoverCard } from "@/components/ui/hover-card";
import { Reveal } from "@/components/ui/reveal";
import { routes, siteConfig } from "@/config/site";
import { CarBranches } from "@/features/cars/components/car-branches";
import { CarGallery } from "@/features/cars/components/car-gallery";
import { getCar } from "@/features/cars/services/cars.service";
import { CarCard } from "@/features/home/components/car-card";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";

// Shared by generateMetadata and the page so the car is fetched once per request.
const loadCar = cache((id: string, locale: string) => {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? getCar(n, locale) : Promise.resolve(null);
});

export async function generateMetadata({ params }: PageProps<"/[locale]/cars/[id]">) {
  const { locale, id } = await params;
  const car = await loadCar(id, locale);
  if (!car) return {};
  const meta = buildMetadata({ locale, path: `/cars/${car.id}`, title: car.name, description: car.description ?? undefined });
  return { ...meta, openGraph: { ...meta.openGraph, images: car.images.slice(0, 1) } };
}

const policies: { key: "renter" | "insurance" | "cancellation"; icon: ReactNode; effect: TargetAndTransition }[] = [
  { key: "renter", icon: <SearchIcon width={20} height={20} />, effect: { rotate: [0, -15, 15, 0], scale: 1.1, transition: { duration: 0.5 } } },
  { key: "insurance", icon: <ShieldIcon width={20} height={20} />, effect: { rotateY: 360, transition: { duration: 0.7 } } },
  { key: "cancellation", icon: <CalendarIcon width={20} height={20} />, effect: { y: [0, -6, 0], transition: { duration: 0.45 } } },
];

export default async function CarDetailsPage({ params }: PageProps<"/[locale]/cars/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const car = await loadCar(id, locale);
  if (!car) notFound();

  const [t, nav] = await Promise.all([getTranslations("carDetails"), getTranslations("nav")]);
  const bookHref = { pathname: routes.booking, query: { car_id: String(car.id) } };
  const price = new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en").format(car.pricePerDay);

  // Structured data so search engines can show the car and its daily price.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.name,
    description: car.description ?? undefined,
    image: car.images.map((src) => (src.startsWith("/") ? `${siteConfig.url}${src}` : src)),
    brand: car.brand ? { "@type": "Brand", name: car.brand } : undefined,
    vehicleModelDate: car.year ?? undefined,
    vehicleTransmission: car.transmission ?? undefined,
    fuelType: car.fuel ?? undefined,
    seatingCapacity: car.seats,
    offers: {
      "@type": "Offer",
      price: car.pricePerDay,
      priceCurrency: "SAR",
      availability: car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const specs = [
    { icon: "/icons/automatic.svg", label: car.transmission },
    { icon: "/icons/fuel.svg", label: car.fuel },
    { icon: "/icons/seets.svg", label: t("seats", { count: car.seats }) },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero title={car.name} trail={[{ label: nav("cars"), href: routes.cars }]} />

      {/* Extra bottom space on phones for the sticky booking bar. */}
      <article className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 pb-28 sm:px-8 sm:py-10 lg:pb-14">
        <CarGallery images={car.images} alt={car.name} />

        <Reveal className="flex flex-col gap-4 rounded-3xl bg-white sm:p-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold sm:text-3xl">{car.name}</h2>
            {car.year && <span className="rounded-md bg-primary-100 px-2.5 py-1 text-sm font-bold text-primary">{car.year}</span>}
          </div>

          <ul className="flex flex-wrap gap-2">
            {specs
              .filter((s) => s.label)
              .map((s) => (
                <li key={s.icon} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium">
                  <Image src={s.icon} alt="" width={16} height={16} className="opacity-70" />
                  {s.label}
                </li>
              ))}
            {car.category && <li className="flex items-center rounded-full bg-field px-3 py-1.5 text-xs font-medium">{car.category}</li>}
            {!car.available && <li className="flex items-center rounded-full bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger">{t("unavailable")}</li>}
          </ul>

          {car.description && (
            <section aria-labelledby="car-desc">
              <h3 id="car-desc" className="mb-2 text-lg font-bold">
                {t("description")}
              </h3>
              <p className="text-sm leading-7 text-ink/80">{car.description}</p>
            </section>
          )}

          {car.features.length > 0 && (
            <section aria-labelledby="car-features">
              <h3 id="car-features" className="mb-3 text-sm font-bold">
                {t("features")}
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-3">
                {car.features.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 text-xs font-medium sm:text-sm">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                      <CheckIcon width={11} height={11} />
                    </span>
                    {f.name}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Reveal>

        {car.branches.length > 0 && (
          <Reveal delay={0.05}>
            <CarBranches branches={car.branches} />
          </Reveal>
        )}

        <Reveal delay={0.05} className="flex items-center justify-between gap-4 border-y border-line py-5">
          <p className="text-lg font-bold sm:text-xl">{t("dailyPrice")}</p>
          <p className="flex items-center gap-1.5">
            <span dir="ltr" className="text-3xl font-bold">
              {price}
            </span>
            <Image src="/icons/KsaSymbol.svg" alt={t("currency")} width={16} height={18} />
            <span className="text-sm text-muted">{t("perDay")}</span>
          </p>
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-3">
          {policies.map((p, i) => (
            <li key={p.key}>
              <HoverCard
                icon={p.icon}
                iconEffect={p.effect}
                delay={i * 0.08}
                className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-white p-5 transition-[box-shadow,border-color] hover:border-primary/40 hover:shadow-[0_18px_40px_-18px_rgb(118_196_25_/_0.5)]"
                iconClassName="size-10 rounded-xl bg-primary-100 text-primary"
              >
                <h3 className="text-base font-bold">{t(`policies.${p.key}.title`)}</h3>
                <ul className="flex list-disc flex-col gap-1.5 ps-4 text-xs leading-6 text-ink/75 marker:text-primary">
                  {[0, 1, 2].map((n) => (
                    <li key={n}>{t(`policies.${p.key}.items.${n}`)}</li>
                  ))}
                </ul>
              </HoverCard>
            </li>
          ))}
        </ul>

        {/* Desktop/tablet booking button; phones use the sticky bar below. */}
        <Reveal className="hidden justify-center lg:flex">
          {car.available ? (
            <Link href={bookHref} className={`${buttonClasses()} min-w-72 transition-transform hover:-translate-y-0.5`}>
              {t("bookNow")}
            </Link>
          ) : (
            <span className={`${buttonClasses()} min-w-72 cursor-not-allowed opacity-60`}>{t("unavailable")}</span>
          )}
        </Reveal>

        {car.similar.length > 0 && (
          <section aria-labelledby="similar-cars" className="mt-4">
            <h2 id="similar-cars" className="mb-4 text-xl font-bold text-primary">
              {t("similar")}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {car.similar.slice(0, 3).map((c, i) => (
                <li key={c.id}>
                  <Reveal delay={i * 0.08}>
                    <CarCard car={c} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Phone booking bar, pinned above the bottom tab bar like an app's checkout button. */}
      <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <p className="flex items-center gap-1">
            <span dir="ltr" className="text-xl font-bold">
              {price}
            </span>
            <Image src="/icons/KsaSymbol.svg" alt={t("currency")} width={13} height={15} />
            <span className="text-xs text-muted">{t("perDay")}</span>
          </p>
          {car.available ? (
            <Link href={bookHref} className={`${buttonClasses({ size: "sm" })} flex-1 active:scale-95`}>
              {t("bookNow")}
            </Link>
          ) : (
            <span className={`${buttonClasses({ size: "sm" })} flex-1 opacity-60`}>{t("unavailable")}</span>
          )}
        </div>
      </div>
    </>
  );
}
