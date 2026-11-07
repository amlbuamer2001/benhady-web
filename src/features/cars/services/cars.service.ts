import "server-only";
import { assetUrl, localize, toFleetCar } from "../lib/car-mappers";
import type { ApiCar, HomeResponse } from "@/features/home/types";
import { serverFetch } from "@/lib/api/server";
import type { ApiBranch, ApiCarDetails, CarBranch, CarDetails, CarFilterOptions, CarFilters, CarsPage, FilterOption, Paginated } from "../types";

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
  const [cities, categories, brands, transmissions, fuelTypes, years] = await Promise.all([
    list("cities", locale),
    // No categories list endpoint (`categories` redirects to a 403), but `GET home` includes them.
    serverFetch<HomeResponse>("home", { locale, revalidate: 3600 })
      .then((r) => r.data.categories)
      .catch(() => []),
    list("brands", locale),
    list("transmissions", locale),
    list("fuel-types", locale),
    serverFetch<{ id: number; year: number }[]>("model-years", { locale, revalidate: 3600 })
      .then((r) => r.data)
      .catch(() => []),
  ]);
  return {
    cities: toOptions(cities),
    categories: toOptions(categories),
    brands: toOptions(brands),
    transmissions: toOptions(transmissions),
    fuelTypes: toOptions(fuelTypes),
    years: years.map((y) => ({ id: y.id, name: String(y.year) })),
  };
}

function toBranch(b: ApiBranch, locale: string): CarBranch {
  const address = b.address ?? (locale === "en" ? b.address_en : b.address_ar) ?? null;
  const lat = Number(b.latitude);
  const lng = Number(b.longitude);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0);
  const query = hasCoords ? `${lat},${lng}` : address;
  return {
    id: b.id,
    name: localize(b, locale),
    city: b.city ? localize(b.city, locale) : null,
    address,
    phone: b.phone ?? null,
    mapUrl: query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null,
  };
}

/**
 * `GET cars/{id}`. Returns `null` for an unknown car (404) so the page can render
 * not-found; other failures throw and reach the error boundary.
 */
export async function getCar(id: number, locale: string): Promise<CarDetails | null> {
  let payload: { car?: ApiCarDetails; similar_cars?: ApiCar[] } & Partial<ApiCarDetails>;
  try {
    payload = (await serverFetch<typeof payload>(`cars/${id}`, { locale, revalidate: 60 })).data;
  } catch (error) {
    if (error instanceof Error && / (404|422)$/.test(error.message)) return null;
    throw error;
  }
  // The live API returns the car itself in `data`; the docs show it under `data.car`.
  const car = (payload.car ?? payload) as ApiCarDetails;
  if (!car?.id) return null;

  const images = [...(car.images ?? [])]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((img) => assetUrl(img.image_path))
    .filter((src): src is string => !!src);

  // `branches` lists every branch with this car; fall back to the single `branch`.
  const branches = car.branches?.length ? car.branches : car.branch ? [car.branch] : [];

  return {
    id: car.id,
    name: localize(car, locale),
    brand: car.brand ? localize(car.brand, locale) : null,
    category: car.category ? localize(car.category, locale) : null,
    year: car.model_year?.year ?? null,
    seats: car.seats,
    pricePerDay: Number(car.daily_price),
    transmission: car.transmission ? localize(car.transmission, locale) : null,
    fuel: car.fuel_type ? localize(car.fuel_type, locale) : null,
    description: car.description ?? (locale === "en" ? car.description_en : car.description_ar) ?? null,
    available: !car.status || car.status === "available",
    images: images.length ? images : ["/images/car-item.jpg"],
    features: (car.features ?? []).map((f) => ({ id: f.id, name: localize(f, locale) })),
    branches: branches.map((b) => toBranch(b, locale)),
    similar: (payload.similar_cars ?? []).map((c) => toFleetCar(c, locale)),
  };
}
