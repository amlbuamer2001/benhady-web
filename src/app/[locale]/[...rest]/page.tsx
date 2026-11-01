import { notFound } from "next/navigation";

// Routes that are not built yet (about, cars, ...) resolve to the locale-aware 404.
export default function CatchAll() {
  notFound();
}
