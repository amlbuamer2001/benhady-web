import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/reset-password">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.reset" });
  return buildMetadata({ locale, path: "/reset-password", title: t("heroTitle"), noIndex: true });
}

export default async function Page({ params }: PageProps<"/[locale]/reset-password">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth.reset");
  return (
    <>
      <PageHero title={t("heroTitle")} />
      <ResetPasswordForm />
    </>
  );
}
