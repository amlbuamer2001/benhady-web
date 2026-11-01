"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { DateField, PhoneField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { useFieldError } from "@/hooks/use-field-error";
import { personalSchema, type PersonalForm } from "../schemas/auth.schemas";
import { StepActions } from "./step-actions";

interface Props {
  defaults?: PersonalForm;
  loading: boolean;
  error?: string;
  onSubmit: (values: PersonalForm) => void;
}

export function StepPersonal({ defaults, loading, error, onSubmit }: Props) {
  const t = useTranslations("auth.register.step1");
  const fieldError = useFieldError();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalForm>({
    resolver: zodResolver(personalSchema),
    defaultValues: defaults ?? { name: "", email: "", phone: "", date_of_birth: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("name")}
        autoComplete="name"
        placeholder={t("namePlaceholder")}
        error={fieldError(errors.name?.message)}
        {...register("name")}
      />
      <TextField
        label={t("email")}
        type="email"
        dir="ltr"
        autoComplete="email"
        placeholder={t("emailPlaceholder")}
        error={fieldError(errors.email?.message)}
        {...register("email")}
      />
      <PhoneField
        label={t("phone")}
        dir="ltr"
        placeholder={t("phonePlaceholder")}
        error={fieldError(errors.phone?.message)}
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
            error={fieldError(errors.date_of_birth?.message)}
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
