import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { routes } from "@/config/site";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { getNotifications } from "@/features/notifications/services/notifications.service";
import type { NotificationItem } from "@/features/notifications/types";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/notifications">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "notifications" });
  return buildMetadata({ locale, path: "/notifications", title: t("heroTitle"), noIndex: true });
}

export default async function NotificationsPage({ params }: PageProps<"/[locale]/notifications">) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!(await getSession())) return redirect({ href: routes.login, locale });

  const [t, format, notifications] = await Promise.all([
    getTranslations("notifications"),
    getFormatter(),
    getNotifications(locale),
  ]);
  const now = new Date();
  const items: NotificationItem[] = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    read: !!n.read_at,
    time: format.relativeTime(new Date(n.created_at), now),
  }));

  return (
    <>
      <PageHero title={t("heroTitle")} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
        <NotificationList items={items} />
      </div>
    </>
  );
}
