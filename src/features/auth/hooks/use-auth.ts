"use client";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useLogin = () => useMutation({ mutationFn: authService.login });
export const useRegisterStepOne = () => useMutation({ mutationFn: authService.registerStepOne });
export const useRegisterStepTwo = () => useMutation({ mutationFn: authService.registerStepTwo });
export const useVerifyPhone = () => useMutation({ mutationFn: authService.verifyPhone });
export const useResendOtp = () => useMutation({ mutationFn: authService.resendOtp });
export const useRequestPasswordResetOtp = () => useMutation({ mutationFn: authService.requestPasswordResetOtp });
export const useResetPassword = () => useMutation({ mutationFn: authService.resetPassword });
export const useLogout = () => useMutation({ mutationFn: authService.logout });
