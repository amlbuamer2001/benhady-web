import { post } from "@/lib/api/client";
import type { Profile } from "../types";

/** ASSUMPTION: endpoint names (proxied through /api/profile/*). Change only here if the backend differs. */
export const profileService = {
  update: (payload: Record<string, string>) => post<Profile>("/profile/update", payload),
  updatePhone: (phone: string) => post<Profile>("/profile/update-phone", { phone }),
  updateLicense: (payload: Record<string, string>) => post<Profile>("/profile/update-license", payload),
  updateIdentity: (payload: Record<string, string>) => post<Profile>("/profile/update-identity", payload),
  changePassword: (payload: Record<string, string>) => post<null>("/profile/change-password", payload),
  deleteAccount: () => post<null>("/profile/delete"),
};
