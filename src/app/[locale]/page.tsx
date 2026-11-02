import { setRequestLocale } from "next-intl/server";
import { About } from "@/features/home/components/about";
import { ContactSection } from "@/features/home/components/contact-section";
import { ExploreFleet } from "@/features/home/components/explore-fleet";
import { Faq } from "@/features/home/components/faq";
import { FleetSlider } from "@/features/home/components/fleet-slider";
import { Hero } from "@/features/home/components/hero";
import { SearchBar } from "@/features/home/components/search-bar";
import { Testimonials } from "@/features/home/components/testimonials";
import { getHome } from "@/features/home/services/home.service";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const home = await getHome(locale);
  return (
    <>
      <Hero />
      <SearchBar />
      {home.featuredCars.length > 0 && <FleetSlider cars={home.featuredCars} />}
      <About />
      {home.categories.length > 0 && <ExploreFleet categories={home.categories} />}
      <Faq />
      <Testimonials />
      <ContactSection />
    </>
  );
}
