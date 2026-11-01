import { del, post } from "@/lib/api/client";

export interface PhoneToken {
  id: number;
  user_id: number;
  phone_token: string;
  created_at: string;
  updated_at: string;
}

/**
 * FCM device token registration (proxied through /api/phone-tokens).
 * Needs a Firebase web app config to obtain `phoneToken`; call `save` after login and `remove` before logout.
 */
export const phoneTokenService = {
  save: (phoneToken: string) => post<PhoneToken>("/phone-tokens", { phone_token: phoneToken }),
  remove: (phoneToken: string) => del<null>("/phone-tokens", { phone_token: phoneToken }),
};
