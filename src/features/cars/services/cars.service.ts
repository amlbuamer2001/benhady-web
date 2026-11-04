import "server-only";
import { localize, toFleetCar } from "../lib/car-mappers";
import type { ApiCar } from "@/features/home/types";
import { serverFetch } from "@/lib/api/server";
import type { CarFilterOptions, CarFilters, CarsPage, FilterOption, Paginated } from "../types";

export const CARS_PER_PAGE = 9;

/** `GET cars` with the active filters. Short cache: listings change, but not per request. */
export async function getCars(filters: CarFilters, page: number, locale: string): Promise<CarsPage> {
  const query = new URLSearchParams({ page: String(page), per_page: String(CARS_PER_PAGE) });
  for (const [key, value] of Object.entries(filters)) if (value) query.set(key, value);
  try {
    const { data } = await serverFetch<Paginated<ApiCar>>(`cars?${query}`, { locale, revalidate: 30 });
    return {
      cars: data.data.map((c) => toFleetCar(c, locale)),
      page: data.current_page,
      lastPage: data.last_page,
      total: data.total,
      count: data.data.length,
    };
  } catch (error) {
    console.error("[cars] failed to load:", error);
    return { cars: [], page: 1, lastPage: 1, total: 0, count: 0 };
  }
}

type Named = { id: number; name?: string; name_ar: string; name_en: string };

async function list(path: string, locale: string): Promise<Named[]> {
  try {
    return (await serverFetch<Named[]>(path, { locale, revalidate: 3600 })).data;
  } catch (error) {
    console.error(`[cars] failed to load ${path}:`, error);
    return [];
  }
}

/** Reference lists for the filter selects; they rarely change, so they're cached for an hour. */
export async function getCarFilterOptions(locale: string): Promise<CarFilterOptions> {
  const toOptions = (items: Named[]): FilterOption[] => items.map((i) => ({ id: i.id, name: localize(i, locale) }));
  const [cities, brands, transmissions, fuelTypes, years] = await Promise.all([
    list("cities", locale),
    list("brands", locale),
    list("transmissions", locale),
    list("fuel-types", locale),
    serverFetch<{ id: number; year: number }[]>("model-years", { locale, revalidate: 3600 })
      .then((r) => r.data)
      .catch(() => []),
  ]);
  return {
    cities: toOptions(cities),
    brands: toOptions(brands),
    transmissions: toOptions(transmissions),
    fuelTypes: toOptions(fuelTypes),
    years: years.map((y) => ({ id: y.id, name: String(y.year) })),
  };
}
