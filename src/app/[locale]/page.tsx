import { setRequestLocale } from "next-intl/server";
import { About } from "@/features/home/components/about";
import { ContactSection } from "@/features/home/components/contact-section";
import { ExploreFleet } from "@/features/home/components/explore-fleet";
import { Faq } from "@/features/home/components/faq";
import { FleetSlider } from "@/features/home/components/fleet-slider";
import { Hero } from "@/features/home/components/hero";
import { SearchBar } from "@/features/home/components/search-bar";
import { Testimonials } from "@/features/home/components/testimonials";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <SearchBar />
      <FleetSlider />
      <About />
      <ExploreFleet />
      <Faq />
      <Testimonials />
      <ContactSection />
    </>
  );
}
