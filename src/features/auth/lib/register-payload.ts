import { dmyToIso } from "@/lib/date";
import type { IdentityType, RegisterStepTwoPayload } from "../types";
import type { IdIdentityForm, LicenseForm, PasswordForm, VisitorIdentityForm } from "../schemas/auth.schemas";

export type IdentityDraft =
  | ({ type: "national_id" | "resident_id" } & IdIdentityForm)
  | ({ type: "visitor" } & VisitorIdentityForm);

export function buildRegisterPayload(
  phone: string,
  identity: IdentityDraft,
  password: PasswordForm,
  license: LicenseForm,
): RegisterStepTwoPayload {
  const common = {
    phone,
    password: password.password,
    password_confirmation: password.password_confirmation,
    driving_license_number: license.driving_license_number,
    license_expiry_date: dmyToIso(license.license_expiry_date),
  };
  if (identity.type === "visitor") {
    return {
      ...common,
      type: "visitor",
      license_number: identity.license_number,
      border_entry_number: identity.border_entry_number,
    };
  }
  return {
    ...common,
    type: identity.type,
    id_number: identity.id_number,
    id_number_end_date: dmyToIso(identity.id_number_end_date),
    version_number: identity.version_number,
  };
}

export const identityTypes: IdentityType[] = ["national_id", "resident_id", "visitor"];
