import "server-only";
import { backendUrl, serverFetch } from "@/lib/api/server";
import type { ApiCar, FleetCar, HomeData, HomeResponse } from "../types";

const FALLBACK_CAR_IMAGE = "/images/car-item.jpg";

type Localized = { name?: string; name_ar: string; name_en: string };
const localize = (item: Localized, locale: string) => item.name || (locale === "en" ? item.name_en : item.name_ar);

/** Image paths may come back absolute or relative to the backend root. */
const assetUrl = (path: string | null | undefined) => (path ? (/^https?:\/\//.test(path) ? path : backendUrl(path)) : null);

function toFleetCar(car: ApiCar, locale: string): FleetCar {
  return {
    id: car.id,
    name: localize(car, locale),
    year: car.model_year?.year ?? null,
    seats: car.seats,
    pricePerDay: Number(car.daily_price),
    image: assetUrl(car.primary_image?.image_path) ?? FALLBACK_CAR_IMAGE,
    transmission: car.transmission ? localize(car.transmission, locale) : null,
    fuel: car.fuel_type ? localize(car.fuel_type, locale) : null,
  };
}

/** `GET home`. Returns empty lists if the backend is unavailable so the page still renders. */
export async function getHome(locale: string): Promise<HomeData> {
  try {
    const { data } = await serverFetch<HomeResponse>("home", { locale });
    return {
      categories: data.categories.map((c) => ({ id: c.id, name: localize(c, locale), icon: assetUrl(c.icon) })),
      featuredCars: data.featured_cars.map((c) => toFleetCar(c, locale)),
      handpickedCars: data.handpicked_cars.map((c) => toFleetCar(c, locale)),
    };
  } catch (error) {
    console.error("[home] failed to load:", error);
    return { categories: [], featuredCars: [], handpickedCars: [] };
  }
}
