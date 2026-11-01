"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/layout/auth-card";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { routes } from "@/config/site";
import { useFieldError } from "@/hooks/use-field-error";
import { useRouter } from "@/i18n/navigation";
import { useApiErrorMessage } from "../hooks/use-api-error-message";
import { useResetPassword } from "../hooks/use-auth";
import { clearAuthFlow, readAuthFlow } from "../lib/auth-flow";
import { passwordSchema, type PasswordForm } from "../schemas/auth.schemas";

export function ResetPasswordForm() {
  const t = useTranslations("auth.reset");
  const fieldError = useFieldError();
  const errorMessage = useApiErrorMessage();
  const router = useRouter();
  const reset = useResetPassword();
  const [phone, setPhone] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    const flow = readAuthFlow();
    if (flow?.flow === "reset" && flow.verified) setPhone(flow.phone);
    else router.replace(routes.forgotPassword);
  }, [router]);

  if (!phone) return null;

  const onSubmit = handleSubmit((values) =>
    reset.mutate(
      { phone, ...values },
      {
        onSuccess: () => {
          clearAuthFlow();
          router.replace(`${routes.login}?reset=1`);
        },
      },
    ),
  );

  return (
    <AuthCard title={t("title")} subtitle={t("subtitle")}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <PasswordField
          label={t("newPassword")}
          autoComplete="new-password"
          placeholder="••••••••"
          error={fieldError(errors.password?.message)}
          {...register("password")}
        />
        <PasswordField
          label={t("confirm")}
          autoComplete="new-password"
          placeholder="••••••••"
          error={fieldError(errors.password_confirmation?.message)}
          {...register("password_confirmation")}
        />
        <FormAlert message={errorMessage(reset.error)} />
        <Button type="submit" fullWidth loading={reset.isPending}>
          {t("submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
