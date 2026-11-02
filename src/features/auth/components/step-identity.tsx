"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { DateField, TextField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useFieldError } from "@/hooks/use-field-error";
import {
  idIdentitySchema,
  visitorIdentitySchema,
  type IdIdentityForm,
  type VisitorIdentityForm,
} from "../schemas/auth.schemas";
import type { IdentityType } from "../types";
import { identityTypes, type IdentityDraft } from "../lib/register-payload";
import { StepActions } from "./step-actions";

interface Props {
  type: IdentityType;
  onTypeChange: (type: IdentityType) => void;
  draft?: IdentityDraft;
  onBack: () => void;
  onSubmit: (identity: IdentityDraft) => void;
}

export function StepIdentity({ type, onTypeChange, draft, onBack, onSubmit }: Props) {
  const t = useTranslations("auth.register.step2");
  const options = identityTypes.map((value) => ({ value, label: t(value) }));

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl options={options} value={type} onChange={onTypeChange} label={t("typeLabel")} />
      {/* `key` resets the form whenever the tab changes so stale fields are never submitted. */}
      {type === "visitor" ? (
        <VisitorForm
          key="visitor"
          defaults={draft?.type === "visitor" ? draft : undefined}
          onBack={onBack}
          onSubmit={(v) => onSubmit({ type: "visitor", ...v })}
        />
      ) : (
        <IdForm
          key={type}
          defaults={draft && draft.type === type ? draft : undefined}
          onBack={onBack}
          onSubmit={(v) => onSubmit({ type, ...v })}
        />
      )}
    </div>
  );
}

function IdForm({
  defaults,
  onBack,
  onSubmit,
}: {
  defaults?: IdIdentityForm;
  onBack: () => void;
  onSubmit: (v: IdIdentityForm) => void;
}) {
  const t = useTranslations("auth.register.step2");
  const fieldError = useFieldError();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IdIdentityForm>({
    resolver: zodResolver(idIdentitySchema),
    defaultValues: defaults ?? { id_number: "", id_number_end_date: "", version_number: "" },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("idNumber")}
        inputMode="numeric"
        maxLength={10}
        placeholder={t("idPlaceholder")}
        error={fieldError(errors.id_number?.message)}
        {...register("id_number")}
      />
      <Controller
        control={control}
        name="id_number_end_date"
        render={({ field }) => (
          <DateField
            label={t("idEndDate")}
            placeholder="DD/MM/YYYY"
            error={fieldError(errors.id_number_end_date?.message)}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
      <TextField
        label={t("versionNumber")}
        placeholder={t("versionPlaceholder")}
        error={fieldError(errors.version_number?.message)}
        {...register("version_number")}
      />
      <StepActions onBack={onBack} />
    </form>
  );
}

function VisitorForm({
  defaults,
  onBack,
  onSubmit,
}: {
  defaults?: VisitorIdentityForm;
  onBack: () => void;
  onSubmit: (v: VisitorIdentityForm) => void;
}) {
  const t = useTranslations("auth.register.step2");
  const fieldError = useFieldError();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VisitorIdentityForm>({
    resolver: zodResolver(visitorIdentitySchema),
    defaultValues: defaults ?? { license_number: "", border_entry_number: "" },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("licenseNumber")}
        placeholder={t("licensePlaceholder")}
        error={fieldError(errors.license_number?.message)}
        {...register("license_number")}
      />
      <TextField
        label={t("borderEntryNumber")}
        inputMode="numeric"
        placeholder={t("borderPlaceholder")}
        error={fieldError(errors.border_entry_number?.message)}
        {...register("border_entry_number")}
      />
      <StepActions onBack={onBack} />
    </form>
  );
}
