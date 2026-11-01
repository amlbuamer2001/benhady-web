import { post } from "@/lib/api/client";
import type {
  LoginPayload,
  RegisterStepOnePayload,
  RegisterStepTwoPayload,
  ResetPasswordPayload,
  SessionResult,
  VerifyPhonePayload,
} from "../types";

export const authService = {
  login: (payload: LoginPayload) => post<SessionResult>("/auth/login", payload),
  registerStepOne: (payload: RegisterStepOnePayload) => post<unknown>("/auth/register-step-one", payload),
  registerStepTwo: (payload: RegisterStepTwoPayload) => post<SessionResult>("/auth/register-step-two", payload),
  verifyPhone: (payload: VerifyPhonePayload) => post<null>("/auth/verify-phone", payload),
  resendOtp: (phone: string) => post<null>("/auth/resend-phone-otp", { phone }),
  /**
   * ASSUMPTION: no dedicated "forgot password" endpoint exists in the docs, so the
   * reset OTP is requested through resend-phone-otp. Change only here if the backend differs.
   */
  requestPasswordResetOtp: (phone: string) => post<null>("/auth/resend-phone-otp", { phone }),
  resetPassword: (payload: ResetPasswordPayload) => post<null>("/auth/reset-password", payload),
  logout: () => post<null>("/auth/logout"),
};
