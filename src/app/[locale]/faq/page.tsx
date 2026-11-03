import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Faq } from "@/features/home/components/faq";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return buildMetadata({ locale, path: "/faq", title: t("heroTitle"), description: t("metaDescription") });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faqPage");
  return (
    <>
      <PageHero title={t("heroTitle")} />
      <Faq />
    </>
  );
}
