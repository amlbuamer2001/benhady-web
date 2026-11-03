"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowIcon } from "@/components/icons";

/** Points "back": right in RTL, left in LTR. */
export function BackButton() {
  const t = useTranslations("common");
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label={t("back")}
      onClick={() => router.back()}
      className="grid size-10 cursor-pointer shrink-0 place-items-center rounded-full border border-ink/70 bg-white transition-[color,border-color,transform] hover:border-primary hover:text-primary active:scale-90 sm:size-11 ltr:rotate-180"
    >
      <ArrowIcon />
    </button>
  );
}
