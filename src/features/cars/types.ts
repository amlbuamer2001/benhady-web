import type { FleetCar } from "@/features/home/types";

/** Laravel paginator envelope returned by `GET cars`. */
export interface Paginated<T> {
  current_page: number;
  data: T[];
  from: number | null;
  to: number | null;
  last_page: number;
  per_page: number;
  total: number;
}

export interface FilterOption {
  id: number;
  name: string;
}

/** Lists that feed the filter selects (cities, brands, transmissions, fuel types, model years). */
export interface CarFilterOptions {
  cities: FilterOption[];
  categories: FilterOption[];
  brands: FilterOption[];
  transmissions: FilterOption[];
  fuelTypes: FilterOption[];
  years: FilterOption[];
}

/**
 * Query params understood by the cars page. Names match the backend's `GET cars`
 * filters so they pass straight through. `pickup_date` / `return_date` are kept in
 * the URL too, but the backend doesn't document filtering by them yet.
 * `branch_id` works but has no list endpoint, so it's URL-only (no select).
 */
export const carFilterKeys = [
  "search",
  "category_id",
  "city_id",
  "branch_id",
  "pickup_date",
  "return_date",
  "brand_id",
  "transmission_id",
  "fuel_type_id",
  "model_year_id",
  "seats",
  "min_price",
  "max_price",
  "sort_by",
  "sort_order",
] as const;

/** Keys that don't count as "active filters" on the filter badge. */
export const nonFilterKeys: readonly CarFilterKey[] = ["search", "sort_by", "sort_order"];

/** Sort choices offered in the UI (the backend accepts `price` and `created_at`, not `name`). */
export const sortOptions = [
  { key: "newest", sort_by: "created_at", sort_order: "desc" },
  { key: "priceAsc", sort_by: "price", sort_order: "asc" },
  { key: "priceDesc", sort_by: "price", sort_order: "desc" },
] as const;
export type CarFilterKey = (typeof carFilterKeys)[number];
export type CarFilters = Partial<Record<CarFilterKey, string>>;

export interface CarsPage {
  cars: FleetCar[];
  page: number;
  lastPage: number;
  total: number;
  /** Number of cars shown on this page. */
  count: number;
}

/* ---------- Car details (`GET cars/{id}`) ---------- */

type ApiNamed = { id: number; name?: string; name_ar: string; name_en: string };

export interface ApiBranch extends ApiNamed {
  address?: string | null;
  address_ar?: string | null;
  address_en?: string | null;
  phone?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  city?: ApiNamed | null;
}

/** Note: the live API returns the car directly in `data` (the docs show `data.car`); both are handled. */
export interface ApiCarDetails extends ApiNamed {
  seats: number;
  daily_price: string;
  description?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  status?: string;
  model_year?: { year: number } | null;
  transmission?: ApiNamed | null;
  fuel_type?: ApiNamed | null;
  brand?: ApiNamed | null;
  category?: ApiNamed | null;
  images?: { id: number; image_path: string; is_primary?: boolean; sort_order?: number }[];
  features?: (ApiNamed & { icon?: string | null })[];
  branch?: ApiBranch | null;
  branches?: ApiBranch[];
}

export interface CarBranch {
  id: number;
  name: string;
  city: string | null;
  address: string | null;
  phone: string | null;
  /** Google Maps link built from the coordinates (or the address when there are none). */
  mapUrl: string | null;
}

export interface CarDetails {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  year: number | null;
  seats: number;
  pricePerDay: number;
  transmission: string | null;
  fuel: string | null;
  description: string | null;
  available: boolean;
  images: string[];
  features: { id: number; name: string }[];
  branches: CarBranch[];
  similar: FleetCar[];
}
