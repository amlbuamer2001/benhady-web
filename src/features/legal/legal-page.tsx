import { getMessages, getTranslations } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { buildMetadata } from "@/lib/seo";

export type LegalDoc = "terms" | "privacy";

interface LegalSection {
  title: string;
  paragraphs: string[];
}

export async function legalMetadata(locale: string, doc: LegalDoc) {
  const t = await getTranslations({ locale, namespace: `legal.${doc}` });
  return buildMetadata({ locale, path: `/${doc}`, title: t("heroTitle"), description: t("metaDescription") });
}

/** Static legal document (terms, privacy): fully server-rendered, each section revealed on scroll. */
export async function LegalPage({ doc }: { doc: LegalDoc }) {
  const t = await getTranslations(`legal.${doc}`);
  // Section lists are arrays, which t() can't return; read them from the raw messages.
  const messages = (await getMessages()) as unknown as { legal: Record<LegalDoc, { sections: LegalSection[] }> };
  const sections = messages.legal[doc].sections;

  return (
    <>
      <PageHero title={t("heroTitle")} />
      <article className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
        {sections.map((section, i) => (
          <Reveal key={section.title} delay={i * 0.05} className="mb-10 last:mb-0">
            <section aria-labelledby={`${doc}-${i}`}>
              <h2 id={`${doc}-${i}`} className="mb-4 flex items-center gap-3 text-xl font-bold sm:text-2xl">
                <span aria-hidden className="h-7 w-1.5 rounded-full bg-primary" />
                {section.title}
              </h2>
              <div className="flex flex-col gap-4 text-sm leading-7 text-ink/80 sm:text-[15px] sm:leading-8">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </article>
    </>
  );
}
