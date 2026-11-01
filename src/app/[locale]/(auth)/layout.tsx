import type { ReactNode } from "react";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/session";

export default async function AuthLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Signed-in users have no business on login/register screens.
  if (await getSession()) redirect({ href: "/", locale });
  return <>{children}</>;
}
