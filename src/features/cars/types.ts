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
  brands: FilterOption[];
  transmissions: FilterOption[];
  fuelTypes: FilterOption[];
  years: FilterOption[];
}

/**
 * Query params understood by the cars page. Names match the backend's `GET cars`
 * filters so they pass straight through. `pickup_date` / `return_date` are kept in
 * the URL too, but the backend doesn't document filtering by them yet.
 */
export const carFilterKeys = [
  "search",
  "city_id",
  "pickup_date",
  "return_date",
  "brand_id",
  "transmission_id",
  "fuel_type_id",
  "model_year_id",
  "seats",
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
