"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Controller, useForm, type Control, type FieldValues, type Path } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DateField, PasswordField, PhoneField, TextField } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/form-alert";
import { useApiErrorMessage } from "@/features/auth/hooks/use-api-error-message";
import { useFieldError } from "@/hooks/use-field-error";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/api-error";
import { dmyToIso, isoToDmy, startOfDay } from "@/lib/date";
import { toApiPhone } from "@/lib/phone";
import { useChangePassword, useUpdateIdentity, useUpdateLicense, useUpdatePhone, useUpdateProfile } from "../hooks/use-profile";
import {
  basicSchema,
  changePasswordSchema,
  drivingLicenseSchema,
  idIdentitySchema,
  phoneSchema,
  visitorIdentitySchema,
  type BasicForm as BasicValues,
  type ChangePasswordForm,
  type DrivingLicenseForm,
  type IdIdentityForm,
  type PhoneForm as PhoneValues,
  type VisitorIdentityForm,
} from "../schemas/profile.schemas";
import type { Profile } from "../types";

/** Only the status fields FormShell reads, so any mutation fits. */
type Mutation = Pick<UseMutationResult, "isPending" | "isSuccess" | "isError" | "error">;

/** Form shell: staggered field entrance, save button, success/error feedback. */
function FormShell({ onSubmit, mutation, children }: { onSubmit: () => void; mutation: Mutation; children: ReactNode }) {
  const t = useTranslations("profile");
  const errorMessage = useApiErrorMessage();
  return (
    <motion.form
      noValidate
      onSubmit={onSubmit}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.07 }}
      className="flex flex-col gap-5"
    >
      {children}
      <AnimatePresence mode="wait">
        {mutation.isSuccess && (
          <motion.div key="ok" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormAlert tone="success" message={t("saved")} />
          </motion.div>
        )}
        {mutation.isError && (
          <motion.div key="err" initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: [0, -8, 8, -4, 4, 0] }} exit={{ opacity: 0 }}>
            <FormAlert message={errorMessage(mutation.error)} />
          </motion.div>
        )}
      </AnimatePresence>
      <Item>
        {/* Pinned above the bottom tab bar on phones, like an app action button. */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="sticky bottom-[calc(var(--bottom-nav-h)+0.75rem)] z-10 mt-2 rounded-full shadow-[0_10px_30px_-10px_rgb(118_196_25_/_0.7)] md:static md:shadow-none">
          <Button type="submit" fullWidth loading={mutation.isPending}>
            {t("save")}
          </Button>
        </motion.div>
      </Item>
    </motion.form>
  );
}

/** One staggered row inside FormShell. */
function Item({ children }: { children: ReactNode }) {
  return <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}>{children}</motion.div>;
}

function serverErrors(error: unknown): Record<string, string> {
  return error instanceof ApiError ? error.fieldErrors : {};
}

function DmyController<T extends FieldValues>({ control, name, label, error, minDate, maxDate }: { control: Control<T>; name: Path<T>; label: string; error?: string; minDate?: Date; maxDate?: Date }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <DateField label={label} placeholder="DD/MM/YYYY" error={error} minDate={minDate} maxDate={maxDate} value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} />
      )}
    />
  );
}

/* ---------- Basic info ---------- */
export function BasicForm({ profile }: { profile: Profile }) {
  const t = useTranslations("profile.basic");
  const fieldError = useFieldError();
  const router = useRouter();
  const mutation = useUpdateProfile();
  const { register, control, handleSubmit, formState: { errors } } = useForm<BasicValues>({
    resolver: zodResolver(basicSchema),
    defaultValues: { name: profile.name ?? "", email: profile.email ?? "", date_of_birth: isoToDmy(profile.date_of_birth) },
  });
  const server = serverErrors(mutation.error);

  const onSubmit = handleSubmit((v) =>
    // Refresh so the header picks up a changed name.
    mutation.mutate({ type: profile.type || undefined, ...v, date_of_birth: dmyToIso(v.date_of_birth) }, { onSuccess: () => router.refresh() }),
  );

  return (
    <FormShell onSubmit={onSubmit} mutation={mutation}>
      <Item><TextField label={t("name")} autoComplete="name" error={fieldError(errors.name?.message) ?? server.name} {...register("name")} /></Item>
      <Item><TextField label={t("email")} type="email" autoComplete="email" error={fieldError(errors.email?.message) ?? server.email} {...register("email")} /></Item>
      <Item><DmyController control={control} name="date_of_birth" maxDate={startOfDay()} label={t("dob")} error={fieldError(errors.date_of_birth?.message) ?? server.date_of_birth} /></Item>
    </FormShell>
  );
}

/* ---------- Phone ---------- */
export function PhoneForm({ profile }: { profile: Profile }) {
  const t = useTranslations("profile.phone");
  const fieldError = useFieldError();
  const mutation = useUpdatePhone();
  const { register, handleSubmit, formState: { errors } } = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: profile.phone?.replace(/^966/, "") ?? "" },
  });
  return (
    <FormShell onSubmit={handleSubmit(({ phone }) => mutation.mutate(toApiPhone(phone)))} mutation={mutation}>
      <Item><PhoneField label={t("label")} placeholder="5X XXX XXXX" error={fieldError(errors.phone?.message) ?? serverErrors(mutation.error).phone} {...register("phone")} /></Item>
    </FormShell>
  );
}

/* ---------- Driving licence ---------- */
export function LicenseForm({ profile }: { profile: Profile }) {
  const t = useTranslations("profile.license");
  const fieldError = useFieldError();
  const mutation = useUpdateLicense();
  const { register, control, handleSubmit, formState: { errors } } = useForm<DrivingLicenseForm>({
    resolver: zodResolver(drivingLicenseSchema),
    defaultValues: {
      driving_license_number: profile.driving_license_number ?? "",
      license_expiry_date: isoToDmy(profile.license_expiry_date),
    },
  });
  const server = serverErrors(mutation.error);
  return (
    <FormShell
      onSubmit={handleSubmit((v) => mutation.mutate({ type: profile.type || undefined, ...v, license_expiry_date: dmyToIso(v.license_expiry_date) }))}
      mutation={mutation}
    >
      <Item>
        <TextField
          label={t("number")}
          placeholder={t("numberPlaceholder")}
          hint={t("hint")}
          error={fieldError(errors.driving_license_number?.message) ?? server.driving_license_number}
          {...register("driving_license_number")}
        />
      </Item>
      <Item><DmyController control={control} name="license_expiry_date" minDate={startOfDay(1)} label={t("expiry")} error={fieldError(errors.license_expiry_date?.message) ?? server.license_expiry_date} /></Item>
    </FormShell>
  );
}

/* ---------- Identity (national / resident ID, or visitor details) ---------- */
export function IdentityForm({ profile }: { profile: Profile }) {
  return profile.type === "visitor" ? <VisitorIdentity profile={profile} /> : <IdIdentity profile={profile} />;
}

function IdIdentity({ profile }: { profile: Profile }) {
  const t = useTranslations("profile.identity");
  const fieldError = useFieldError();
  const mutation = useUpdateIdentity();
  const { register, control, handleSubmit, formState: { errors } } = useForm<IdIdentityForm>({
    resolver: zodResolver(idIdentitySchema),
    defaultValues: {
      id_number: profile.id_number ?? "",
      id_number_end_date: isoToDmy(profile.id_number_end_date),
      version_number: profile.version_number ?? "",
    },
  });
  const server = serverErrors(mutation.error);
  return (
    <FormShell
      onSubmit={handleSubmit((v) =>
        mutation.mutate({ type: profile.type || "resident_id", ...v, id_number_end_date: dmyToIso(v.id_number_end_date) }),
      )}
      mutation={mutation}
    >
      <Item><TextField label={t("idNumber")} inputMode="numeric" maxLength={10} placeholder="2XXXXXXXXX" error={fieldError(errors.id_number?.message) ?? server.id_number} {...register("id_number")} /></Item>
      <Item><DmyController control={control} name="id_number_end_date" minDate={startOfDay(1)} label={t("idEndDate")} error={fieldError(errors.id_number_end_date?.message) ?? server.id_number_end_date} /></Item>
      <Item><TextField label={t("versionNumber")} placeholder="32 XXXX" error={fieldError(errors.version_number?.message) ?? server.version_number} {...register("version_number")} /></Item>
    </FormShell>
  );
}

function VisitorIdentity({ profile }: { profile: Profile }) {
  const t = useTranslations("profile.identity");
  const fieldError = useFieldError();
  const mutation = useUpdateIdentity();
  const { register, handleSubmit, formState: { errors } } = useForm<VisitorIdentityForm>({
    resolver: zodResolver(visitorIdentitySchema),
    defaultValues: { license_number: profile.license_number ?? "", border_entry_number: profile.border_entry_number ?? "" },
  });
  const server = serverErrors(mutation.error);
  return (
    <FormShell onSubmit={handleSubmit((v) => mutation.mutate({ type: "visitor", ...v }))} mutation={mutation}>
      <Item><TextField label={t("licenseNumber")} error={fieldError(errors.license_number?.message) ?? server.license_number} {...register("license_number")} /></Item>
      <Item><TextField label={t("borderEntryNumber")} inputMode="numeric" error={fieldError(errors.border_entry_number?.message) ?? server.border_entry_number} {...register("border_entry_number")} /></Item>
    </FormShell>
  );
}

/* ---------- Password ---------- */
export function PasswordForm() {
  const t = useTranslations("profile.password");
  const fieldError = useFieldError();
  const mutation = useChangePassword();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: "", password: "", password_confirmation: "" },
  });
  const server = serverErrors(mutation.error);
  return (
    <FormShell onSubmit={handleSubmit((v) => mutation.mutate(v, { onSuccess: () => reset() }))} mutation={mutation}>
      <Item><PasswordField label={t("current")} autoComplete="current-password" placeholder="••••••••" error={fieldError(errors.current_password?.message) ?? server.current_password} {...register("current_password")} /></Item>
      <Item><PasswordField label={t("new")} autoComplete="new-password" placeholder="••••••••" error={fieldError(errors.password?.message) ?? server.password} {...register("password")} /></Item>
      <Item><PasswordField label={t("confirm")} autoComplete="new-password" placeholder="••••••••" error={fieldError(errors.password_confirmation?.message)} {...register("password_confirmation")} /></Item>
    </FormShell>
  );
}
