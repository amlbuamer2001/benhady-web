import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { routes } from "@/config/site";
import { ProfileView } from "@/features/profile/components/profile-view";
import type { Profile, ProfileTab } from "@/features/profile/types";
import { redirect } from "@/i18n/navigation";
import { serverFetch } from "@/lib/api/server";
import { getSession } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";

const tabs: ProfileTab[] = ["basic", "phone", "license", "identity", "password", "delete"];

export async function generateMetadata({ params }: PageProps<"/[locale]/profile">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  return buildMetadata({ locale, path: "/profile", title: t("heroTitle"), noIndex: true });
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/profile">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  if (!session) return redirect({ href: routes.login, locale });

  // Keep the page usable if the endpoint is unavailable; forms start empty.
  const fallback: Profile = { id: session.user?.id ?? 0, name: session.user?.name ?? "", email: "", phone: "", date_of_birth: "", type: "", status: "" };
  let profile = fallback;
  try {
    // The docs nest the user under `data.user`, but the live backend returns it as `data` itself: accept both.
    const { data } = await serverFetch<{ user?: Profile } | Profile | null>("auth/me", { locale, auth: true, revalidate: false });
    const user = data && "user" in data ? data.user : (data as Profile | null);
    if (user?.id) profile = { ...fallback, ...user };
  } catch (error) {
    console.error("[profile] auth/me failed:", error);
  }

  const { tab } = await searchParams;
  const initialTab = tabs.find((t) => t === tab);
  const t = await getTranslations("profile");

  return (
    <>
      <PageHero title={t("heroTitle")} />
      <ProfileView profile={profile} initialTab={initialTab} />
    </>
  );
}
