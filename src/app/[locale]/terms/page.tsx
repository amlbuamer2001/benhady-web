import { setRequestLocale } from "next-intl/server";
import { LegalPage, legalMetadata } from "@/features/legal/legal-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  return legalMetadata(locale, "terms");
}

export default async function TermsPage({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc="terms" />;
}
