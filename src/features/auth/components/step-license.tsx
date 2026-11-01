"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { DateField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { routes } from "@/config/site";
import { useFieldError } from "@/hooks/use-field-error";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/api-error";
import { licenseSchema, type LicenseForm } from "../schemas/auth.schemas";
import { StepActions } from "./step-actions";

interface Props {
  loading: boolean;
  error?: string;
  apiError?: unknown;
  onBack: () => void;
  onSubmit: (values: LicenseForm) => void;
}

export function StepLicense({ loading, error, apiError, onBack, onSubmit }: Props) {
  const t = useTranslations("auth.register.step4");
  const fieldError = useFieldError();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LicenseForm>({
    resolver: zodResolver(licenseSchema),
    defaultValues: { driving_license_number: "", license_expiry_date: "", terms: false },
  });

  // Server-side field errors (e.g. duplicate id) for fields that live on this step.
  const server = apiError instanceof ApiError ? apiError.fieldErrors : {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("drivingLicense")}
        dir="ltr"
        placeholder={t("drivingPlaceholder")}
        hint={t("drivingHint")}
        error={fieldError(errors.driving_license_number?.message) ?? server.driving_license_number}
        {...register("driving_license_number")}
      />
      <Controller
        control={control}
        name="license_expiry_date"
        render={({ field }) => (
          <DateField
            label={t("licenseExpiry")}
            placeholder="DD/MM/YYYY"
            error={fieldError(errors.license_expiry_date?.message) ?? server.license_expiry_date}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
      <Checkbox error={fieldError(errors.terms?.message)} {...register("terms")}>
        {t.rich("terms", {
          link: (chunks) => (
            <Link href={routes.terms} className="text-primary underline">
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
