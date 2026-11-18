"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PasswordField } from "@/components/ui/field";
import { useFieldError } from "@/hooks/use-field-error";
import { useServerMessage, type ServerErrors } from "../lib/register-errors";
import { passwordSchema, type PasswordForm } from "../schemas/auth.schemas";
import { StepActions } from "./step-actions";

interface Props {
  defaults?: Partial<PasswordForm>;
  /** Called as the user types, so the wizard can keep it when the page is left. */
  onDraftChange?: (values: Partial<PasswordForm>) => void;
  serverErrors?: ServerErrors;
  onBack: () => void;
  onSubmit: (values: PasswordForm) => void;
}

export function StepPassword({ defaults, onDraftChange, serverErrors, onBack, onSubmit }: Props) {
  const t = useTranslations("auth.register.step3");
  const fieldError = useFieldError();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", password_confirmation: "", ...defaults },
  });

  useEffect(() => {
    if (!onDraftChange) return;
    const sub = watch((values) => onDraftChange(values));
    return () => sub.unsubscribe();
  }, [watch, onDraftChange]);
  const server = useServerMessage(serverErrors, watch());
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <PasswordField
        label={t("password")}
        autoComplete="new-password"
        placeholder="••••••••"
        error={fieldError(errors.password?.message) ?? server("password")}
        {...register("password")}
      />
      <PasswordField
        label={t("confirm")}
        autoComplete="new-password"
        placeholder="••••••••"
        error={fieldError(errors.password_confirmation?.message) ?? server("password_confirmation")}
        {...register("password_confirmation")}
      />
      <StepActions onBack={onBack} />
    </form>
  );
}
