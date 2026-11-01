import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { VerifyPhoneForm } from "@/features/auth/components/verify-phone-form";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/verify-phone">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.verify" });
  return buildMetadata({ locale, path: "/verify-phone", title: t("heroTitle"), noIndex: true });
}

export default async function Page({ params }: PageProps<"/[locale]/verify-phone">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.verify");
  return (
    <>
      <PageHero title={t("heroTitle")} />
      <VerifyPhoneForm />
    </>
  );
}
