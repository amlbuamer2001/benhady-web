import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { BranchesMapLazy } from "@/features/contact/components/branches-map-lazy";
import { branches } from "@/features/contact/data/branches";
import { ContactSection } from "@/features/home/components/contact-section";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return buildMetadata({ locale, path: "/contact", title: t("heroTitle"), description: t("metaDescription") });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const tb = await getTranslations("branches");

  return (
    <>
      <PageHero title={t("heroTitle")} />
      <ContactSection />
      <section aria-label={t("branches")}>
        <Reveal from="zoom" className="relative z-0 h-[360px] overflow-hidden sm:h-[440px] lg:h-[520px]">
          <BranchesMapLazy branches={branches.map((b) => ({ ...b, name: tb(b.key) }))} label={t("mapLabel")} />
        </Reveal>
      </section>
    </>
  );
}
