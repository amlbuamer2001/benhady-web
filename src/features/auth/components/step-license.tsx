"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { DateField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { routes } from "@/config/site";
import { useFieldError } from "@/hooks/use-field-error";
import { startOfDay } from "@/lib/date";
import { Link } from "@/i18n/navigation";
import { serverMessage, type ServerErrors } from "../lib/register-errors";
import { licenseSchema, type LicenseForm } from "../schemas/auth.schemas";
import { StepActions } from "./step-actions";

interface Props {
  loading: boolean;
  error?: string;
  /** Server errors for this step's fields, shown under each field. */
  serverErrors?: ServerErrors;
  /** What was typed before (restored after leaving the page). */
  defaults?: Partial<LicenseForm>;
  /** Called as the user types, so the wizard can save progress. */
  onDraftChange?: (values: Partial<LicenseForm>) => void;
  onBack: () => void;
  onSubmit: (values: LicenseForm) => void;
}

export function StepLicense({ loading, error, serverErrors, defaults, onDraftChange, onBack, onSubmit }: Props) {
  const t = useTranslations("auth.register.step4");
  const fieldError = useFieldError();
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<LicenseForm>({
    resolver: zodResolver(licenseSchema),
    defaultValues: { driving_license_number: "", license_expiry_date: "", terms: false, ...defaults },
  });

  useEffect(() => {
    if (!onDraftChange) return;
    const sub = watch((values) => onDraftChange(values));
    return () => sub.unsubscribe();
  }, [watch, onDraftChange]);

  const server = serverMessage(serverErrors, dirtyFields);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("drivingLicense")}
        placeholder={t("drivingPlaceholder")}
        hint={t("drivingHint")}
        error={fieldError(errors.driving_license_number?.message) ?? server("driving_license_number")}
        {...register("driving_license_number")}
      />
      <Controller
        control={control}
        name="license_expiry_date"
        render={({ field }) => (
          <DateField
            label={t("licenseExpiry")}
            minDate={startOfDay(1)}
            placeholder="DD/MM/YYYY"
            error={fieldError(errors.license_expiry_date?.message) ?? server("license_expiry_date")}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
      <Checkbox error={fieldError(errors.terms?.message) ?? server("terms")} {...register("terms")}>
        {t.rich("terms", {
          link: (chunks) => (
            <Link href={routes.terms} target="_blank" rel="noopener" className="text-primary underline">
              {chunks}
            </Link>
          ),
        })}
      </Checkbox>
      <FormAlert message={error} />
      <StepActions onBack={onBack} nextLabel={t("submit")} loading={loading} />
    </form>
  );
}
