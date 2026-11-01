import type { IdentityType } from "@/features/auth/types";
import type { AuthUser } from "@/lib/api/types";

/**
 * ASSUMPTION: shape of `GET profile`. Field names mirror the register payloads;
 * adjust here if the backend differs.
 */
export interface Profile extends AuthUser {
  identity_type?: IdentityType | null;
  id_number?: string | null;
  id_number_end_date?: string | null;
  version_number?: string | null;
  license_number?: string | null;
  border_entry_number?: string | null;
  driving_license_number?: string | null;
  license_expiry_date?: string | null;
}

export type ProfileTab = "basic" | "phone" | "license" | "identity" | "password" | "delete";
