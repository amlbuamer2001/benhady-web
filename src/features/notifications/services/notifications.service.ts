import "server-only";
import { serverFetch } from "@/lib/api/server";
import type { ApiNotification } from "../types";

/** Sample data so the screen can be designed against before the endpoint exists (development only). */
function devSamples(locale: string): ApiNotification[] {
  const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
  const ar = locale === "ar";
  return [
    { id: "s1", title: ar ? "تم تأكيد حجزك" : "Booking confirmed", body: ar ? "تم تأكيد حجز تويوتا كامري 2025 ، الاستلام من فرع مطار الملك خالد الدولي ." : "Your Toyota Camry 2025 is confirmed for pick-up at King Khalid International Airport.", read_at: null, created_at: ago(120) },
    { id: "s2", title: ar ? "تذكير بموعد الاستلام" : "Pick-up reminder", body: ar ? "موعد استلام سيارتك غداً الساعة 10:00 صباحاً ، لا تنسَ إحضار الهوية والرخصة ." : "Your pick-up is tomorrow at 10:00 AM. Don’t forget your ID and licence.", read_at: null, created_at: ago(30) },
    { id: "s3", title: ar ? "عرض خاص لك" : "A special offer for you", body: ar ? "خصم 15٪ على الإيجار الأسبوعي لفترة محدودة ، لا تفوّت الفرصة !" : "15% off weekly rentals for a limited time. Don’t miss it!", read_at: ago(5), created_at: ago(10) },
  ];
}

/**
 * ASSUMPTION: `GET notifications` (authenticated). Falls back to an empty list in
 * production, and to sample data in development, when the endpoint isn't available.
 */
export async function getNotifications(locale: string): Promise<ApiNotification[]> {
  try {
    const { data } = await serverFetch<ApiNotification[] | { data: ApiNotification[] }>("notifications", { locale, auth: true, revalidate: false });
    return Array.isArray(data) ? data : data.data;
  } catch (error) {
    console.error("[notifications] failed to load:", error);
    return process.env.NODE_ENV === "production" ? [] : devSamples(locale);
  }
}
