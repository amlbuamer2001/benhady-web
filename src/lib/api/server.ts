import "server-only";
import { getSession } from "@/lib/auth/session";
import type { ApiResponse } from "./types";

export function backendUrl(path: string): string {
  const base = process.env.API_BASE_URL ?? "http://benhady.test/";
  return new URL(path.replace(/^\//, ""), base.endsWith("/") ? base : `${base}/`).toString();
}

/**
 * Server Component data fetching (cars, content, ...). Uses native fetch so
 * Next.js caching / revalidation can be controlled per call.
 */
export async function serverFetch<T>(
  path: string,
  options: { locale?: string; auth?: boolean; revalidate?: number | false } = {},
): Promise<ApiResponse<T>> {
  const { locale = "ar", auth = false, revalidate = 60 } = options;
  const headers: Record<string, string> = { Accept: "application/json", "Accept-Language": locale };
  if (auth) {
    const session = await getSession();
    if (session) headers.Authorization = `Bearer ${session.token}`;
  }
  const res = await fetch(backendUrl(path), { headers, next: { revalidate: revalidate === false ? 0 : revalidate } });
  if (!res.ok) throw new Error(`Request to ${path} failed with ${res.status}`);
  return (await res.json()) as ApiResponse<T>;
}
