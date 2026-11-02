import { post } from "@/lib/api/client";
import type { Profile } from "../types";

/** Proxied through /api/profile/*; the backend path for each action lives in that route handler. */
type Payload = Record<string, string | undefined>;

export const profileService = {
  update: (payload: Payload) => post<{ user: Profile }>("/profile/update", payload),
  updatePhone: (phone: string) => post<Profile>("/profile/update-phone", { phone }),
  updateLicense: (payload: Payload) => post<{ user: Profile }>("/profile/update-license", payload),
  updateIdentity: (payload: Payload) => post<{ user: Profile }>("/profile/update-identity", payload),
  changePassword: (payload: Record<string, string>) => post<null>("/profile/change-password", payload),
  deleteAccount: () => post<null>("/profile/delete"),
};
