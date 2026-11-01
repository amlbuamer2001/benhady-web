"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function LogoutButton({ size = "sm", fullWidth }: { size?: "sm" | "md"; fullWidth?: boolean }) {
  const t = useTranslations("nav");
  const router = useRouter();
  const { mutate, isPending } = useLogout();
  return (
    <Button
      variant="outline"
      size={size}
      fullWidth={fullWidth}
      loading={isPending}
      onClick={() => mutate(undefined, { onSettled: () => { router.replace("/"); router.refresh(); } })}
    >
      {t("logout")}
    </Button>
  );
}
