import { z } from "zod";

/** Messages are translation keys under the `validation` namespace. */
export const inquiryTypes = ["other", "booking", "complaint", "suggestion"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(3, "nameMin"),
  email: z.string().min(1, "required").pipe(z.email("emailInvalid")),
  type: z.enum(inquiryTypes),
  message: z.string().trim().min(10, "messageMin"),
});
export type ContactForm = z.infer<typeof contactSchema>;
