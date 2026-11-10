import { ApiError } from "@/lib/api/api-error";

export type RegisterStep = 1 | 2 | 3 | 4;
export type ServerErrors = Partial<Record<string, string>>;

/** Which wizard step owns each field the backend can complain about. */
export const STEP_FIELDS: Record<RegisterStep, readonly string[]> = {
  1: ["name", "email", "phone", "date_of_birth"],
  2: ["type", "id_number", "id_number_end_date", "version_number", "license_number", "border_entry_number"],
  3: ["password", "password_confirmation"],
  4: ["driving_license_number", "license_expiry_date", "terms"],
};

/**
 * The backend's validation errors currently arrive as one sentence (`{ code: 422, message }`)
 * without the field name, so the field is recognised from the wording (Arabic or English,
 * e.g. "حقل البريد الإلكتروني مستخدم من قبل"). Most specific patterns first.
 */
const PATTERNS: ReadonlyArray<[field: string, pattern: RegExp]> = [
  ["password_confirmation", /تأكيد كلمة|password confirmation|confirm(ation)? password/i],
  ["password", /كلمة (ال)?مرور|كلمة السر|password/i],
  ["license_expiry_date", /انتهاء (ال)?رخصة|license expiry|licen[cs]e expir/i],
  ["driving_license_number", /رخصة (ال)?قيادة|driving licen[cs]e/i],
  ["id_number_end_date", /انتهاء (ال)?(هوية|إقامة|اقامة)|id number end|id expir/i],
  ["version_number", /النسخة|version/i],
  ["border_entry_number", /(ال)?حدود|border/i],
  ["license_number", /رقم (ال)?رخصة|licen[cs]e number/i],
  ["id_number", /(ال)?هوية|(ال)?إقامة|(ال)?اقامة|id number|iqama|national id/i],
  ["date_of_birth", /(ال)?ميلاد|birth/i],
  ["email", /(ال)?بريد|e-?mail/i],
  ["phone", /(ال)?جوال|(ال)?هاتف|phone|mobile/i],
  ["terms", /(ال)?شروط|terms/i],
  ["name", /(ال)?اسم|\bname\b/i],
];

function guessField(message: string): string | undefined {
  // The raw key sometimes appears as-is ("The id_number has already been taken").
  // Only multi-word keys: a bare "name"/"type" would match ordinary words in any sentence.
  const lower = message.toLowerCase();
  const raw = Object.values(STEP_FIELDS)
    .flat()
    .filter((f) => f.includes("_"))
    .find((f) => lower.includes(f) || lower.includes(f.replace(/_/g, " ")));
  return raw ?? PATTERNS.find(([, re]) => re.test(message))?.[0];
}

/** Field → message for a failed request: the backend's `errors` object, else guessed from its message. */
export function serverFieldErrors(error: unknown): ServerErrors {
  if (!(error instanceof ApiError)) return {};
  if (Object.keys(error.fieldErrors).length > 0) return error.fieldErrors;
  const field = error.message ? guessField(error.message) : undefined;
  return field ? { [field]: error.message } : {};
}

/** The first step that has an error, so the wizard can jump there. */
export function firstStepWithError(errors: ServerErrors): RegisterStep | undefined {
  return ([1, 2, 3, 4] as const).find((s) => STEP_FIELDS[s].some((f) => errors[f]));
}

/** Only the errors that belong to `step`. */
export function errorsForStep(errors: ServerErrors, step: RegisterStep): ServerErrors {
  return Object.fromEntries(STEP_FIELDS[step].filter((f) => errors[f]).map((f) => [f, errors[f]]));
}

/**
 * Message to show under `field`: hidden again as soon as the user edits that field,
 * so a fixed value doesn't keep showing the old server complaint.
 */
export function serverMessage(errors: ServerErrors | undefined, dirty: Partial<Record<string, unknown>>) {
  return (field: string) => (dirty[field] ? undefined : errors?.[field]);
}
