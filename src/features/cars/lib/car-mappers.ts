import "server-only";
import type { ApiCar, FleetCar } from "@/features/home/types";
import { backendUrl } from "@/lib/api/server";

/** API → view-model mapping shared by every server service that returns cars (home, cars listing, ...). */

const FALLBACK_CAR_IMAGE = "/images/car-item.jpg";

type Localized = { name?: string; name_ar: string; name_en: string };

/** `name` follows Accept-Language; fall back to the locale-specific field. */
export const localize = (item: Localized, locale: string) => item.name || (locale === "en" ? item.name_en : item.name_ar);

/** Image paths may come back absolute or relative to the backend root. */
export const assetUrl = (path: string | null | undefined) => (path ? (/^https?:\/\//.test(path) ? path : backendUrl(path)) : null);

export function toFleetCar(car: ApiCar, locale: string): FleetCar {
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
