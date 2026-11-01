import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { RegisterWizard } from "@/features/auth/components/register-wizard";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/register">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.register" });
  return buildMetadata({ locale, path: "/register", title: t("heroTitle"), noIndex: true });
}

export default async function Page({ params }: PageProps<"/[locale]/register">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.register");
  return (
    <>
      <PageHero title={t("heroTitle")} />
      <RegisterWizard />
    </>
  );
}
