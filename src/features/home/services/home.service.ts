import "server-only";
import { assetUrl, localize, toFleetCar } from "@/features/cars/lib/car-mappers";
import { serverFetch } from "@/lib/api/server";
import type { HomeData, HomeResponse } from "../types";

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
