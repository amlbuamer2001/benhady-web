import type { LicenseForm, PasswordForm, PersonalForm } from "../schemas/auth.schemas";
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
  passwordDraft = undefined;
  try {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(PERSONAL_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Step 1 as typed, before "next" is pressed. Kept apart from the flow itself: the OTP
 * screen treats any stored flow as a pending verification.
 */
const PERSONAL_KEY = "bh:register-personal";

export function readPersonalDraft(): Partial<PersonalForm> | null {
  try {
    const raw = sessionStorage.getItem(PERSONAL_KEY);
    return raw ? (JSON.parse(raw) as Partial<PersonalForm>) : null;
  } catch {
    return null;
  }
}

export function savePersonalDraft(values: Partial<PersonalForm>): void {
  try {
    sessionStorage.setItem(PERSONAL_KEY, JSON.stringify(values));
  } catch {
    /* storage unavailable */
  }
}

/**
 * The register password lives in module memory only: it survives in-app navigation
 * (terms page, OTP screen, browser back) but never reaches storage, and a reload drops it.
 */
let passwordDraft: Partial<PasswordForm> | undefined;

export const registerPasswordDraft = {
  get: () => passwordDraft,
  set: (values: Partial<PasswordForm>) => {
    passwordDraft = values;
  },
};
