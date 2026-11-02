/** Localized fields: `name` follows Accept-Language; `name_ar` / `name_en` are always present. */
interface Localized {
  name?: string;
  name_ar: string;
  name_en: string;
}

export interface ApiCategory extends Localized {
  id: number;
  icon: string | null;
}

export interface ApiBrand extends Localized {
  id: number;
  logo: string | null;
}

export interface ApiCar extends Localized {
  id: number;
  seats: number;
  daily_price: string;
  model_year?: { year: number } | null;
  transmission?: Localized | null;
  fuel_type?: Localized | null;
  primary_image?: { image_path: string } | null;
}

export interface HomeResponse {
  categories: ApiCategory[];
  brands?: ApiBrand[];
  featured_cars: ApiCar[];
  handpicked_cars: ApiCar[];
}

/** View models handed to the (client) home components. */
export interface FleetCar {
  id: number;
  name: string;
  year: number | null;
  seats: number;
  pricePerDay: number;
  image: string;
  transmission: string | null;
  fuel: string | null;
}

export interface FleetCategory {
  id: number;
  name: string;
  icon: string | null;
}

export interface HomeData {
  categories: FleetCategory[];
  featuredCars: FleetCar[];
  handpickedCars: FleetCar[];
}
