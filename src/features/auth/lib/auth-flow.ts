import type { LicenseForm, PersonalForm } from "../schemas/auth.schemas";
import type { IdentityType } from "../types";
import type { IdentityDraft } from "./register-payload";

/** Register steps 2–4 in progress, saved as the user types so leaving the page loses nothing (no passwords). */
export interface RegisterDraft {
  step: 1 | 2 | 3 | 4;
  identityType: IdentityType;
  identity?: IdentityDraft;
  license?: Partial<LicenseForm>;
}

/**
 * Small sessionStorage-backed state that survives leaving the register page (OTP screen, terms…)
 * and coming back. It holds the phone, a "verified" flag and the typed details – never passwords.
 */
export type AuthFlowKind = "register" | "reset";
export interface AuthFlow {
  flow: AuthFlowKind;
  phone: string; // API format
  verified: boolean;
  /** Register only: what was typed on step 1, so "edit phone" brings it all back. */
  personal?: PersonalForm;
  /** Set by "edit phone" on the OTP screen: reopen the form with the phone field focused. */
  editingPhone?: boolean;
  /** Register only, after the phone is verified. */
  draft?: RegisterDraft;
}

const KEY = "bh:auth-flow";

export function readAuthFlow(): AuthFlow | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthFlow) : null;
  } catch {
    return null;
  }
}

export function saveAuthFlow(flow: AuthFlow): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(flow));
  } catch {
    /* storage unavailable – flow will restart */
  }
}

export function clearAuthFlow(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
