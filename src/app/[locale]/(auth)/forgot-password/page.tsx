import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/forgot-password">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.forgot" });
  return buildMetadata({ locale, path: "/forgot-password", title: t("heroTitle"), noIndex: true });
}

export default async function Page({ params }: PageProps<"/[locale]/forgot-password">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.forgot");
  return (
    <>
      <PageHero title={t("heroTitle")} />
      <ForgotPasswordForm />
    </>
  );
}
