import type { TargetAndTransition } from "motion/react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { AwardIcon, ClockIcon, FingerprintIcon, GlobeIcon, RocketIcon, ShieldIcon } from "@/components/icons";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { AboutGallery } from "@/features/about/components/about-gallery";
import { CountUp } from "@/features/about/components/count-up";
import { HoverCard } from "@/components/ui/hover-card";
import { Testimonials } from "@/features/home/components/testimonials";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return buildMetadata({ locale, path: "/about", title: t("heroTitle"), description: t("metaDescription") });
}

const features: { key: "fleet" | "support" | "branches"; icon: ReactNode; effect: TargetAndTransition }[] = [
  { key: "fleet", icon: <GlobeIcon width={22} height={22} />, effect: { rotate: 360, transition: { duration: 0.7 } } },
  { key: "support", icon: <FingerprintIcon width={22} height={22} />, effect: { scale: [1, 1.25, 1], transition: { duration: 0.5 } } },
  { key: "branches", icon: <RocketIcon width={22} height={22} />, effect: { x: [0, 4, -2, 0], y: [0, -6, 2, 0], transition: { duration: 0.6 } } },
];

const stats = [
  { key: "years", value: 1400, grouping: false },
  { key: "cars", value: 4000, grouping: true },
  { key: "branches", value: 16, grouping: true },
  { key: "customers", value: 70000, grouping: true },
] as const;

const values: { key: "transparency" | "safety" | "speed" | "satisfaction"; icon: ReactNode; effect: TargetAndTransition }[] = [
  { key: "transparency", icon: <ShieldIcon width={22} height={22} />, effect: { rotateY: 360, transition: { duration: 0.7 } } },
  { key: "safety", icon: <AwardIcon width={22} height={22} />, effect: { rotate: [0, -15, 15, -8, 0], transition: { duration: 0.6 } } },
  { key: "speed", icon: <ClockIcon width={22} height={22} />, effect: { rotate: 360, transition: { duration: 0.8 } } },
  { key: "satisfaction", icon: <ShieldIcon width={22} height={22} />, effect: { y: [0, -8, 0, -4, 0], transition: { duration: 0.6 } } },
];

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");

  return (
    <>
      <PageHero title={t("heroTitle")} />

      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Reveal from="start">
              <p className="text-lg font-bold text-primary">{t("eyebrow")}</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t("title")}</h1>
              <p className="mt-4 text-sm leading-7 text-ink/80 sm:text-base sm:leading-8">{t("body")}</p>
            </Reveal>

            <ul className="flex flex-col gap-5">
              {features.map((f, i) => (
                <li key={f.key}>
                  <HoverCard
                    icon={f.icon}
                    iconEffect={f.effect}
                    delay={0.1 + i * 0.1}
                    className="flex items-start gap-4"
                    iconClassName="size-12 rounded-2xl bg-white text-primary shadow-[0_6px_20px_-8px_rgb(0_0_0_/_0.2)]"
                  >
                    <div>
                      <h2 className="text-base font-bold">{t(`features.${f.key}.title`)}</h2>
                      <p className="mt-1 text-xs leading-6 text-ink/75 sm:text-sm">{t(`features.${f.key}.body`)}</p>
                    </div>
                  </HoverCard>
                </li>
              ))}
            </ul>
          </div>

          <AboutGallery imageAlt={t("imageAlt")} imageSmAlt={t("imageSmAlt")} satisfactionLabel={t("satisfaction")} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-8">
          <dl aria-label={t("stats.label")} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.key} from="zoom" delay={i * 0.08}>
                <div className="flex flex-col items-center gap-1 rounded-3xl bg-white/70 px-3 py-6 text-center lg:bg-transparent">
                  <dd dir="ltr" className="order-first text-3xl font-bold sm:text-4xl">
                    {/* "+" stays on the left in both directions, like the design. */}
                    <span className="text-primary">+</span>
                    <CountUp to={s.value} grouping={s.grouping} />
                  </dd>
                  <dt className="text-xs text-ink/70 sm:text-sm">{t(`stats.${s.key}`)}</dt>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="values-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-8">
        <Reveal className="mb-10 text-center">
          <h2 id="values-title" className="text-2xl font-bold text-primary">
            {t("values.title")}
          </h2>
          <p className="mt-2 text-sm text-ink/75">{t("values.subtitle")}</p>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <li key={v.key} className="h-full">
              <HoverCard
                icon={v.icon}
                iconEffect={v.effect}
                delay={i * 0.08}
                className="flex h-full flex-col items-center gap-3 rounded-3xl border border-line bg-white p-6 text-center transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-18px_rgb(118_196_25_/_0.55)]"
                iconClassName="size-12 rounded-2xl bg-primary text-white"
              >
                <h3 className="text-base font-bold">{t(`values.${v.key}.title`)}</h3>
                <p className="text-xs leading-6 text-ink/75 sm:text-sm">{t(`values.${v.key}.body`)}</p>
              </HoverCard>
            </li>
          ))}
        </ul>
      </section>

      <Testimonials />
    </>
  );
}
