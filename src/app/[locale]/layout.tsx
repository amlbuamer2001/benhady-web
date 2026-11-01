import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import { localeDirection, routing } from "@/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets the bottom bar sit above the iPhone home indicator
  themeColor: "#ffffff",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t("title"), template: `%s | ${t("siteName")}` },
    description: t("description"),
    appleWebApp: { capable: true, title: t("siteName"), statusBarStyle: "default" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  preload("/fonts/alfont_com_29LT-Kaff-Medium.ttf", { as: "font", type: "font/ttf", crossOrigin: "anonymous" });

  return (
    <html lang={locale} dir={localeDirection[locale]}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <Providers>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
