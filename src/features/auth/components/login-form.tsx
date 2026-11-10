"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/layout/auth-card";
import { buttonClasses, Button } from "@/components/ui/button";
import { PasswordField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { routes } from "@/config/site";
import { useFieldError } from "@/hooks/use-field-error";
import { Link, useRouter } from "@/i18n/navigation";
import { useApiErrorMessage } from "../hooks/use-api-error-message";
import { useLogin } from "../hooks/use-auth";
import { loginSchema, type LoginForm as LoginValues } from "../schemas/auth.schemas";

export function LoginForm({ notice }: { notice?: "reset" }) {
  const t = useTranslations("auth.login");
  const fieldError = useFieldError();
  const errorMessage = useApiErrorMessage();
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onSuccess: () => {
        router.replace("/");
        router.refresh();
      },
    }),
  );

  return (
    <AuthCard title={t("title")} subtitle={t("subtitle")}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {notice === "reset" && <FormAlert tone="success" message={t("resetSuccess")} />}
        <TextField
          label={t("identifier")}
          inputMode="numeric"
          autoComplete="username"
          placeholder={t("identifierPlaceholder")}
          error={fieldError(errors.identifier?.message)}
          {...register("identifier")}
        />
        <div className="flex flex-col gap-2">
          <PasswordField
            label={t("password")}
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            error={fieldError(errors.password?.message)}
            {...register("password")}
          />
          <Link href={routes.forgotPassword} className="w-fit self-end text-[11px] text-danger underline">
            {t("forgot")}
          </Link>
        </div>
        <FormAlert message={errorMessage(login.error)} />
        <div className="flex flex-col gap-3">
          <Button type="submit" fullWidth loading={login.isPending}>
            {t("submit")}
          </Button>
          <Link href={routes.register} className={buttonClasses({ variant: "outline", fullWidth: true })}>
            {t("register")}
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
