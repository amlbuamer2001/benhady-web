"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { DateField, PhoneField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { useFieldError } from "@/hooks/use-field-error";
import { startOfDay } from "@/lib/date";
import { serverMessage, type ServerErrors } from "../lib/register-errors";
import { personalSchema, type PersonalForm } from "../schemas/auth.schemas";
import { StepActions } from "./step-actions";

interface Props {
  defaults?: PersonalForm;
  loading: boolean;
  error?: string;
  /** Server errors for this step's fields (e.g. "email already taken"), shown under each field. */
  serverErrors?: ServerErrors;
  /** Put the cursor in the phone field (user came back to change the number). */
  focusPhone?: boolean;
  onSubmit: (values: PersonalForm) => void;
}

export function StepPersonal({ defaults, loading, error, serverErrors, focusPhone, onSubmit }: Props) {
  const t = useTranslations("auth.register.step1");
  const fieldError = useFieldError();
  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors, dirtyFields },
  } = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: defaults ?? { name: "", email: "", phone: "", date_of_birth: "" },
  });

  useEffect(() => {
    if (focusPhone) setFocus("phone", { shouldSelect: true });
  }, [focusPhone, setFocus]);

  const server = serverMessage(serverErrors, dirtyFields);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("name")}
        autoComplete="name"
        placeholder={t("namePlaceholder")}
        error={fieldError(errors.name?.message) ?? server("name")}
        {...register("name")}
      />
      <TextField
        label={t("email")}
        type="email"
        autoComplete="email"
        placeholder={t("emailPlaceholder")}
        error={fieldError(errors.email?.message) ?? server("email")}
        {...register("email")}
      />
      <PhoneField
        label={t("phone")}
        placeholder={t("phonePlaceholder")}
        error={fieldError(errors.phone?.message) ?? server("phone")}
        {...register("phone")}
      />
      <Controller
        control={control}
        name="date_of_birth"
        render={({ field }) => (
          <DateField
            label={t("dob")}
            placeholder={t("dobPlaceholder")}
            hint={t("dobHint")}
            maxDate={startOfDay()}
            error={fieldError(errors.date_of_birth?.message) ?? server("date_of_birth")}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
      <FormAlert message={error} />
      <StepActions loading={loading} />
    </form>
  );
}
