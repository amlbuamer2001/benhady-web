import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BackButton } from "./back-button";

/** Light-green title band with breadcrumb used at the top of inner pages. */
export async function PageHero({ title }: { title: string }) {
  const t = await getTranslations("nav");
  return (
    <section className="rounded-b-[1.75rem] bg-primary-50 sm:rounded-b-[2rem]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:gap-4 sm:px-8 sm:py-6">
        <BackButton />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold sm:text-xl">{title}</h1>
          <nav aria-label="Breadcrumb" className="hidden sm:block">
            <ol className="flex items-center gap-2 text-xs">
              <li>
                <Link href="/" className="text-primary">
                  {t("home")}
                </Link>
              </li>
              <li aria-hidden className="flex">
                {/* Points "forward": left in RTL, mirrored for LTR. */}
                <Image src="/icons/breadcrumb-arrow.svg" alt="" width={7} height={10} className="h-2.5 w-auto ltr:-scale-x-100" />
              </li>
              <li aria-current="page">{title}</li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
