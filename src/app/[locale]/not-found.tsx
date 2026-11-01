import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-8">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="mt-3 text-sm text-muted">{t("comingSoon")}</p>
    </section>
  );
}
