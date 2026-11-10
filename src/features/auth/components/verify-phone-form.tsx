"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AuthCard } from "@/components/layout/auth-card";
import { Button } from "@/components/ui/button";
import { FormAlert } from "@/components/ui/form-alert";
import { OtpInput } from "@/components/ui/otp-input";
import { routes } from "@/config/site";
import { useFieldError } from "@/hooks/use-field-error";
import { Link, useRouter } from "@/i18n/navigation";
import { formatApiPhone } from "@/lib/phone";
import { useApiErrorMessage } from "../hooks/use-api-error-message";
import { useResendOtp, useVerifyPhone } from "../hooks/use-auth";
import { readAuthFlow, saveAuthFlow, type AuthFlow } from "../lib/auth-flow";
import { otpSchema, type OtpForm } from "../schemas/auth.schemas";

const RESEND_SECONDS = 60;

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function VerifyPhoneForm() {
  const t = useTranslations("auth.verify");
  const fieldError = useFieldError();
  const errorMessage = useApiErrorMessage();
  const router = useRouter();
  const verify = useVerifyPhone();
  const resend = useResendOtp();
  const [flow, setFlow] = useState<AuthFlow | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpForm>({ resolver: zodResolver(otpSchema), defaultValues: { code: "" } });

  useEffect(() => {
    const stored = readAuthFlow();
    if (!stored) router.replace(routes.login);
    else setFlow(stored);
  }, [router]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  if (!flow) return null;

  const onSubmit = handleSubmit(({ code }) =>
    verify.mutate(
      { phone: flow.phone, code },
      {
        onSuccess: () => {
          saveAuthFlow({ ...flow, verified: true });
          router.replace(flow.flow === "register" ? routes.register : routes.resetPassword);
        },
      },
    ),
  );

  const onResend = () =>
    resend.mutate(flow.phone, { onSuccess: () => setSecondsLeft(RESEND_SECONDS) });

  const editHref = flow.flow === "register" ? routes.register : routes.forgotPassword;

  return (
    <AuthCard title={flow.flow === "register" ? t("titleRegister") : t("titleReset")} subtitle={t("subtitle")}>
      <div className="-mt-6 mb-8 flex items-center justify-center gap-3 text-xs">
        <span dir="ltr" className="font-bold text-primary">
          {formatApiPhone(flow.phone)}
        </span>
        <Link href={editHref} onClick={() => saveAuthFlow({ ...flow, verified: false, editingPhone: true })} className="text-primary underline underline-offset-4 transition-colors hover:text-primary-hover">
          {t("edit")}
        </Link>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <OtpInput autoFocus label={t("codeLabel")} value={field.value} onChange={field.onChange} invalid={!!errors.code} />
          )}
        />
        {errors.code && (
          <p role="alert" className="text-center text-xs text-danger">
            {fieldError(errors.code.message)}
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] text-muted">
           <span dir="ltr" aria-live="off">
            {secondsLeft > 0 ? formatTimer(secondsLeft) : ""}
          </span>
          <button
            type="button"
            onClick={onResend}
            disabled={secondsLeft > 0 || resend.isPending}
            className="enabled:text-primary enabled:underline disabled:cursor-not-allowed"
          >
            {t("resend")}
          </button>
        
        </div>

        <FormAlert message={errorMessage(verify.error ?? resend.error)} />
        {resend.isSuccess && secondsLeft === RESEND_SECONDS && <FormAlert tone="success" message={t("resent")} />}
        <Button type="submit" fullWidth loading={verify.isPending}>
          {t("submit")}
        </Button>
      </form>
    </AuthCard>
  );
}
