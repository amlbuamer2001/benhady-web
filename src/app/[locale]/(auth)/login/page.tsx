import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { LoginForm } from "@/features/auth/components/login-form";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.login" });
  return buildMetadata({ locale, path: "/login", title: t("heroTitle"), noIndex: true });
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { reset } = await searchParams;
  const t = await getTranslations("auth.login");
  return (
    <>
      <PageHero title={t("heroTitle")} />
      <LoginForm notice={reset === "1" ? "reset" : undefined} />
    </>
  );
}
