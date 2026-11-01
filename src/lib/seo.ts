import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { routing } from "@/i18n/routing";

interface BuildMetadataInput {
  locale: string;
  path: string;
  title: string;
  description?: string;
  noIndex?: boolean;
}

export function buildMetadata({ locale, path, title, description, noIndex }: BuildMetadataInput): Metadata {
  const suffix = path === "/" ? "" : path;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${suffix}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${suffix}`])),
    },
    openGraph: { title, description, locale, siteName: "Bin Hadi", url: `${siteConfig.url}/${locale}${suffix}` },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
