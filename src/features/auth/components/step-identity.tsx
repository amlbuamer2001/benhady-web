"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Controller, useForm, type UseFormWatch } from "react-hook-form";
import { DateField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useFieldError } from "@/hooks/use-field-error";
import { startOfDay } from "@/lib/date";
import {
  idIdentitySchemaFor,
  type IdType,
  visitorIdentitySchema,
  type IdIdentityForm,
  type VisitorIdentityForm,
} from "../schemas/auth.schemas";
import type { IdentityType } from "../types";
import { identityTypes, type IdentityDraft } from "../lib/register-payload";
import { serverMessage, type ServerErrors } from "../lib/register-errors";
import { StepActions } from "./step-actions";

interface Props {
  type: IdentityType;
  onTypeChange: (type: IdentityType) => void;
  draft?: IdentityDraft;
  /** Called as the user types, so the wizard can save progress. */
  onDraftChange?: (identity: IdentityDraft) => void;
  /** Server errors for this step's fields, shown under each field. */
  serverErrors?: ServerErrors;
  onBack: () => void;
  onSubmit: (identity: IdentityDraft) => void;
}

/** Reports every edit of a form to `onChange`. */
function useReportChanges<T extends object>(watch: UseFormWatch<T>, onChange?: (values: T) => void) {
  useEffect(() => {
    if (!onChange) return;
    const sub = watch((values) => onChange(values as T));
    return () => sub.unsubscribe();
  }, [watch, onChange]);
}

const VISITOR_FIELDS = ["license_number", "border_entry_number"];
const ID_FIELDS = ["id_number", "id_number_end_date", "version_number"];

export function StepIdentity({ type, onTypeChange, draft, onDraftChange, serverErrors = {}, onBack, onSubmit }: Props) {
  const t = useTranslations("auth.register.step2");
  const options = identityTypes.map((value) => ({ value, label: t(value) }));
  // An error for a field the current tab doesn't show (e.g. "type", or a visitor field) becomes an alert.
  const shown = type === "visitor" ? VISITOR_FIELDS : ID_FIELDS;
  const orphan = Object.entries(serverErrors).find(([field, msg]) => msg && !shown.includes(field))?.[1];

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl options={options} value={type} onChange={onTypeChange} label={t("typeLabel")} />
      <FormAlert message={orphan} />
      {/* `key` resets the form whenever the tab changes so stale fields are never submitted. */}
      {type === "visitor" ? (
        <VisitorForm
          key="visitor"
          defaults={draft?.type === "visitor" ? draft : undefined}
          onChange={onDraftChange && ((v) => onDraftChange({ type: "visitor", ...v }))}
          serverErrors={serverErrors}
          onBack={onBack}
          onSubmit={(v) => onSubmit({ type: "visitor", ...v })}
        />
      ) : (
        <IdForm
          key={type}
          type={type}
          defaults={draft && draft.type === type ? draft : undefined}
          onChange={onDraftChange && ((v) => onDraftChange({ type, ...v }))}
          serverErrors={serverErrors}
          onBack={onBack}
          onSubmit={(v) => onSubmit({ type, ...v })}
        />
      )}
    </div>
  );
}

function IdForm({
  type,
  defaults,
  onChange,
  serverErrors,
  onBack,
  onSubmit,
}: {
  type: IdType;
  defaults?: IdIdentityForm;
  onChange?: (v: IdIdentityForm) => void;
  serverErrors?: ServerErrors;
  onBack: () => void;
  onSubmit: (v: IdIdentityForm) => void;
}) {
  const t = useTranslations("auth.register.step2");
  const fieldError = useFieldError();
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<IdIdentityForm>({
    resolver: zodResolver(idIdentitySchemaFor(type)),
    defaultValues: defaults ?? { id_number: "", id_number_end_date: "", version_number: "" },
  });
  useReportChanges(watch, onChange);
  const server = serverMessage(serverErrors, dirtyFields);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("idNumber")}
        inputMode="numeric"
        maxLength={10}
        placeholder={type === "national_id" ? "1XXXXXXXXX" : "2XXXXXXXXX"}
        error={fieldError(errors.id_number?.message) ?? server("id_number")}
        {...register("id_number")}
      />
      <Controller
        control={control}
        name="id_number_end_date"
        render={({ field }) => (
          <DateField
            label={t("idEndDate")}
            minDate={startOfDay(1)}
            placeholder="DD/MM/YYYY"
            error={fieldError(errors.id_number_end_date?.message) ?? server("id_number_end_date")}
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
        inputMode="numeric"
        maxLength={2}
        error={fieldError(errors.version_number?.message) ?? server("version_number")}
        {...register("version_number")}
      />
      <StepActions onBack={onBack} />
    </form>
  );
}

function VisitorForm({
  defaults,
  onChange,
  serverErrors,
  onBack,
  onSubmit,
}: {
  defaults?: VisitorIdentityForm;
  onChange?: (v: VisitorIdentityForm) => void;
  serverErrors?: ServerErrors;
  onBack: () => void;
  onSubmit: (v: VisitorIdentityForm) => void;
}) {
  const t = useTranslations("auth.register.step2");
  const fieldError = useFieldError();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<VisitorIdentityForm>({
    resolver: zodResolver(visitorIdentitySchema),
    defaultValues: defaults ?? { license_number: "", border_entry_number: "" },
  });
  useReportChanges(watch, onChange);
  const server = serverMessage(serverErrors, dirtyFields);
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label={t("licenseNumber")}
        placeholder={t("licensePlaceholder")}
        error={fieldError(errors.license_number?.message) ?? server("license_number")}
        {...register("license_number")}
      />
      <TextField
        label={t("borderEntryNumber")}
        inputMode="numeric"
        placeholder={t("borderPlaceholder")}
        error={fieldError(errors.border_entry_number?.message) ?? server("border_entry_number")}
        {...register("border_entry_number")}
      />
      <StepActions onBack={onBack} />
    </form>
  );
}
