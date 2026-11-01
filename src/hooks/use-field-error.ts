"use client";
import { useTranslations } from "next-intl";

/** Translates a validation message key coming from a Zod schema. */
export function useFieldError() {
  const t = useTranslations("validation");
  return (key?: string) => (key ? t(key as Parameters<typeof t>[0]) : undefined);
}
