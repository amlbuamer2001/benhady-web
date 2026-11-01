import type { AuthUser } from "@/lib/api/types";

export type IdentityType = "national_id" | "resident_id" | "visitor";

export interface SessionResult {
  user: AuthUser;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterStepOnePayload {
  name: string;
  email: string;
  phone: string; // API format 966XXXXXXXXX
  date_of_birth: string; // Y-m-d
}

interface RegisterStepTwoBase {
  phone: string;
  password: string;
  password_confirmation: string;
  driving_license_number: string;
  license_expiry_date: string; // Y-m-d
}

export type RegisterStepTwoPayload = RegisterStepTwoBase &
  (
    | { type: "national_id" | "resident_id"; id_number: string; id_number_end_date: string; version_number: string }
    | { type: "visitor"; license_number: string; border_entry_number: string }
  );

export interface VerifyPhonePayload {
  phone: string;
  code: string;
}

export interface ResetPasswordPayload {
  phone: string;
  password: string;
  password_confirmation: string;
}
