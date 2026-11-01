"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { PasswordField } from "@/components/ui/field";
import { useFieldError } from "@/hooks/use-field-error";
import { passwordSchema, type PasswordForm } from "../schemas/auth.schemas";
import { StepActions } from "./step-actions";

interface Props {
  defaults?: PasswordForm;
  onBack: () => void;
  onSubmit: (values: PasswordForm) => void;
}

export function StepPassword({ defaults, onBack, onSubmit }: Props) {
  const t = useTranslations("auth.register.step3");
  const fieldError = useFieldError();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: defaults ?? { password: "", password_confirmation: "" },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <PasswordField
        label={t("password")}
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
      <StepActions onBack={onBack} />
    </form>
  );
}
