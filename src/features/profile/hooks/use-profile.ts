"use client";
import { useMutation } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

export const useUpdateProfile = () => useMutation({ mutationFn: profileService.update });
export const useUpdatePhone = () => useMutation({ mutationFn: profileService.updatePhone });
export const useUpdateLicense = () => useMutation({ mutationFn: profileService.updateLicense });
export const useUpdateIdentity = () => useMutation({ mutationFn: profileService.updateIdentity });
export const useChangePassword = () => useMutation({ mutationFn: profileService.changePassword });
export const useDeleteAccount = () => useMutation({ mutationFn: profileService.deleteAccount });
