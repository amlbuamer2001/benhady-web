import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import { BackButton } from "./back-button";

interface Crumb {
  label: string;
  href: string;
}

function Separator() {
  return (
    <li aria-hidden className="flex">
      {/* Points "forward": left in RTL, mirrored for LTR. */}
      <Image src="/icons/breadcrumb-arrow.svg" alt="" width={7} height={10} className="h-2.5 w-auto ltr:-scale-x-100" />
    </li>
  );
}

/** Light-green title band with breadcrumb used at the top of inner pages. `trail` adds steps between Home and the page. */
export async function PageHero({ title, trail = [] }: { title: string; trail?: Crumb[] }) {
  const t = await getTranslations("nav");
  const crumbs: Crumb[] = [{ label: t("home"), href: "/" }, ...trail];
  return (
    <section className="rounded-b-[1.75rem] bg-primary-50 sm:rounded-b-[2rem]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:gap-4 sm:px-8 sm:py-6">
        <BackButton />
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="truncate text-lg font-bold sm:text-xl">{title}</h1>
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-2 text-xs">
              {crumbs.map((c) => (
                <Fragment key={c.href}>
                  <li>
                    <Link href={c.href} className="text-primary">
                      {c.label}
                    </Link>
                  </li>
                  <Separator />
                </Fragment>
              ))}
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
