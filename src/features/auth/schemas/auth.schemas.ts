import { z } from "zod";
import { ageInYears, isFutureDate, parseDmy } from "@/lib/date";

/** All messages are translation keys under the `validation` namespace. */
const required = "required";

const dmyDate = z
  .string()
  .min(1, required)
  .refine((v) => parseDmy(v) !== null, "dateInvalid");

const futureDmyDate = dmyDate.refine((v) => {
  const d = parseDmy(v);
  return d ? isFutureDate(d) : true;
}, "dateFuture");

const tenDigits = z
  .string()
  .min(1, required)
  .regex(/^\d+$/, "digitsOnly")
  .length(10, "idLength");

export const loginSchema = z.object({
  identifier: z.string().min(1, required).regex(/^\d+$/, "digitsOnly"),
  password: z.string().min(1, required),
});
export type LoginForm = z.infer<typeof loginSchema>;

export const phoneSchema = z.object({
  phone: z.string().min(1, required).regex(/^0?5\d{8}$/, "phoneInvalid"),
});
export type PhoneForm = z.infer<typeof phoneSchema>;

/** Full name as on the ID: at least two names of 2+ letters each (same rule as the mobile app). */
const fullName = z
  .string()
  .trim()
  .min(1, "nameFull")
  .refine((v) => {
    const parts = v.split(/\s+/);
    return parts.length >= 2 && parts.every((p) => p.length >= 2);
  }, "nameFull");

export const personalSchema = z.object({
  name: fullName,
  email: z.string().min(1, required).pipe(z.email("emailInvalid")),
  phone: phoneSchema.shape.phone,
  date_of_birth: dmyDate.refine((v) => {
    const d = parseDmy(v);
    return d ? ageInYears(d) >= 21 : true;
  }, "minAge"),
});
export type PersonalForm = z.infer<typeof personalSchema>;

export const idIdentitySchema = z.object({
  id_number: tenDigits,
  id_number_end_date: futureDmyDate,
  version_number: z.string().trim().min(1, required),
});
export type IdIdentityForm = z.infer<typeof idIdentitySchema>;

export const visitorIdentitySchema = z.object({
  license_number: z.string().trim().min(1, required),
  border_entry_number: z.string().trim().min(1, required).regex(/^\d+$/, "digitsOnly"),
});
export type VisitorIdentityForm = z.infer<typeof visitorIdentitySchema>;

export const passwordSchema = z
  .object({
    password: z.string().min(8, "passwordMin"),
    password_confirmation: z.string().min(1, required),
  })
  .refine((v) => v.password === v.password_confirmation, {
    path: ["password_confirmation"],
    message: "passwordMismatch",
  });
export type PasswordForm = z.infer<typeof passwordSchema>;

export const licenseSchema = z.object({
  driving_license_number: z.string().trim().min(1, required),
  license_expiry_date: futureDmyDate,
  terms: z.boolean().refine((v) => v === true, "termsRequired"),
});
export type LicenseForm = z.infer<typeof licenseSchema>;

export const otpSchema = z.object({
  code: z.string().regex(/^\d{4}$/, "otpIncomplete"),
});
export type OtpForm = z.infer<typeof otpSchema>;
