import type { IdentityType } from "@/features/auth/types";
import type { AuthUser } from "@/lib/api/types";

/**
 * User returned by `GET auth/me`. The licence / identity fields are not in that
 * response yet, so they stay optional and those forms start empty until they are.
 */
export interface Profile extends AuthUser {
  type: IdentityType | "";
  phone_verified?: boolean;
  licence_verified?: boolean;
  id_verified?: boolean;
  id_number?: string | null;
  id_number_end_date?: string | null;
  version_number?: string | null;
  license_number?: string | null;
  border_entry_number?: string | null;
  driving_license_number?: string | null;
  license_expiry_date?: string | null;
  city_id?: number | null;
}

export type ProfileTab = "basic" | "phone" | "license" | "identity" | "password" | "delete";
