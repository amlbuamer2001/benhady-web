import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { CarFilters } from "@/features/cars/components/car-filters";
import { CarsPagination } from "@/features/cars/components/cars-pagination";
import { CarsResults, CarsShell } from "@/features/cars/components/cars-shell";
import { getCarFilterOptions, getCars } from "@/features/cars/services/cars.service";
import { carFilterKeys, type CarFilters as Filters } from "@/features/cars/types";
import { CarCard } from "@/features/home/components/car-card";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/cars">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "carsPage" });
  return buildMetadata({ locale, path: "/cars", title: t("heroTitle"), description: t("metaDescription") });
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CarsPage({ params, searchParams }: PageProps<"/[locale]/cars">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;

  const filters: Filters = {};
  for (const key of carFilterKeys) {
    const value = first(sp[key])?.trim();
    if (value) filters[key] = value;
  }
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const [t, result, options] = await Promise.all([getTranslations("carsPage"), getCars(filters, page, locale), getCarFilterOptions(locale)]);

  return (
    <>
      <PageHero title={t("heroTitle")} />
      <CarsShell>
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[300px_1fr] lg:gap-8 lg:py-14">
          <CarFilters options={options} initial={filters} />

          <CarsResults>
            {result.total > 0 && (
              <p className="mb-4 text-sm text-ink/75">{t("showing", { count: result.count, total: result.total })}</p>
            )}

            {result.cars.length > 0 ? (
              <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.cars.map((car, i) => (
                  <li key={car.id}>
                    <Reveal from="up" delay={(i % 3) * 0.08}>
                      <CarCard car={car} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : (
              <Reveal from="zoom" className="flex flex-col items-center gap-2 rounded-3xl bg-field px-6 py-20 text-center">
                <p className="text-lg font-bold">{t("emptyTitle")}</p>
                <p className="text-sm text-muted">{t("emptyHint")}</p>
              </Reveal>
            )}

            <CarsPagination page={result.page} lastPage={result.lastPage} filters={filters} />
          </CarsResults>
        </div>
      </CarsShell>
    </>
  );
}
