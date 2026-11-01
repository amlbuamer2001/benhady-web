/**
 * Small sessionStorage-backed state that survives the hop to /verify-phone and back.
 * It only holds the phone number and a "verified" flag – never passwords.
 */
export type AuthFlowKind = "register" | "reset";
export interface AuthFlow {
  flow: AuthFlowKind;
  phone: string; // API format
  verified: boolean;
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
