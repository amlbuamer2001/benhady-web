"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthCard } from "@/components/layout/auth-card";
import { Button } from "@/components/ui/button";
import { PhoneField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { routes } from "@/config/site";
import { useFieldError } from "@/hooks/use-field-error";
import { useRouter } from "@/i18n/navigation";
import { toApiPhone } from "@/lib/phone";
import { useApiErrorMessage } from "../hooks/use-api-error-message";
import { useRequestPasswordResetOtp } from "../hooks/use-auth";
import { readAuthFlow, saveAuthFlow } from "../lib/auth-flow";
import { phoneSchema, type PhoneForm } from "../schemas/auth.schemas";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgot");
  const fieldError = useFieldError();
  const errorMessage = useApiErrorMessage();
  const router = useRouter();
  const request = useRequestPasswordResetOtp();
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema) });

  // Back from the OTP screen via "edit phone": bring the number back instead of an empty field.
  useEffect(() => {
    const flow = readAuthFlow();
    if (flow?.flow !== "reset" || !flow.editingPhone) return;
    reset({ phone: flow.phone.replace(/^966/, "0") });
    saveAuthFlow({ ...flow, editingPhone: false });
    setTimeout(() => setFocus("phone", { shouldSelect: true }));
  }, [reset, setFocus]);

  const onSubmit = handleSubmit(({ phone }) => {
    const apiPhone = toApiPhone(phone);
    request.mutate(apiPhone, {
      onSuccess: () => {
        saveAuthFlow({ flow: "reset", phone: apiPhone, verified: false });
        router.push(routes.verifyPhone);
      },
    });
  });

  return (
    <AuthCard title={t("title")} subtitle={t("subtitle")}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <PhoneField
          label={t("phone")}
          placeholder="05 XXXX XXX"
          error={fieldError(errors.phone?.message)}
          {...register("phone")}
        />
        <FormAlert message={errorMessage(request.error)} />
        <Button type="submit" fullWidth loading={request.isPending}>
          {t("submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
