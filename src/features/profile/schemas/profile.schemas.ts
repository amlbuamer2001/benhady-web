import { z } from "zod";
import { licenseSchema, passwordSchema, personalSchema } from "@/features/auth/schemas/auth.schemas";

export { idIdentitySchema, phoneSchema, visitorIdentitySchema } from "@/features/auth/schemas/auth.schemas";
export type { IdIdentityForm, PhoneForm, VisitorIdentityForm } from "@/features/auth/schemas/auth.schemas";

export const basicSchema = personalSchema.omit({ phone: true });
export type BasicForm = z.infer<typeof basicSchema>;

export const drivingLicenseSchema = licenseSchema.omit({ terms: true });
export type DrivingLicenseForm = z.infer<typeof drivingLicenseSchema>;

export const changePasswordSchema = z
  .object({ current_password: z.string().min(1, "required") })
  .and(passwordSchema);
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
