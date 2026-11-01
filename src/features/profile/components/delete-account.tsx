"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FormAlert } from "@/components/ui/form-alert";
import { useApiErrorMessage } from "@/features/auth/hooks/use-api-error-message";
import { useRouter } from "@/i18n/navigation";
import { useDeleteAccount } from "../hooks/use-profile";

export function DeleteAccount() {
  const t = useTranslations("profile.delete");
  const errorMessage = useApiErrorMessage();
  const router = useRouter();
  const mutation = useDeleteAccount();

  return (
    <div className="flex flex-col items-center gap-5 rounded-3xl border border-danger/20 bg-danger/5 p-8 text-center">
      <motion.span
        aria-hidden
        animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
        className="grid size-16 place-items-center rounded-full bg-danger/10 text-danger"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
        </svg>
      </motion.span>
      <h2 className="text-lg font-bold text-danger">{t("title")}</h2>
      <p className="max-w-sm text-sm leading-6 text-muted">{t("body")}</p>
      <FormAlert message={mutation.isError ? errorMessage(mutation.error) : undefined} />
      <motion.button
        type="button"
        disabled={mutation.isPending}
        aria-busy={mutation.isPending || undefined}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-danger text-sm font-medium text-white transition-colors hover:bg-danger/90 disabled:opacity-60"
        onClick={() =>
          mutation.mutate(undefined, {
            onSuccess: () => {
              router.replace("/");
              router.refresh();
            },
          })
        }
      >
        {mutation.isPending && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {t("confirm")}
      </motion.button>
    </div>
  );
}
