"use client";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api/api-error";

/** Returns a user-facing message for a failed mutation (server message first, then a translated fallback). */
export function useApiErrorMessage() {
  const t = useTranslations("common");
  return (error: unknown): string | undefined => {
    if (!error) return undefined;
    if (error instanceof ApiError) {
      // 502-504 come from our BFF when the backend itself can't be reached.
      if (error.isNetwork || (error.status >= 502 && error.status <= 504 && !error.message)) return t("networkError");
      return error.message || t("genericError");
    }
    return t("genericError");
  };
}
