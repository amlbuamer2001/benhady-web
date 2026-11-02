import "server-only";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE, USER_COOKIE } from "@/lib/auth/constants";
import { backendUrl } from "./server";
import type { ApiResponse, AuthUser } from "./types";

/**
 * Shared plumbing for the BFF route handlers (`/api/*`): they forward browser
 * requests to the backend and keep the access token in an httpOnly cookie.
 */

const cookieBase = {
  httpOnly: true,
  secure: (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://"),
  sameSite: "lax" as const,
  path: "/",
};

export function failure(status: number, messages: string[] = []) {
  return NextResponse.json({ code: status, data: null, messages, errors: [] }, { status });
}

export function readToken(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=([^;]+)`).exec(cookieHeader)?.[1];
}

export function setSessionCookies(res: NextResponse, token: string, user: Pick<AuthUser, "id" | "name">, maxAge: number) {
  res.cookies.set(TOKEN_COOKIE, token, { ...cookieBase, maxAge });
  res.cookies.set(USER_COOKIE, JSON.stringify({ id: user.id, name: user.name }), { ...cookieBase, maxAge });
}

/** Updates the display name without touching the token or its expiry. */
export function setUserCookie(res: NextResponse, user: Pick<AuthUser, "id" | "name">) {
  res.cookies.set(USER_COOKIE, JSON.stringify({ id: user.id, name: user.name }), cookieBase);
}

export function clearSessionCookies(res: NextResponse) {
  res.cookies.delete(TOKEN_COOKIE);
  res.cookies.delete(USER_COOKIE);
}

/** JSON object -> multipart body (the backend docs use form-data for several endpoints). */
function toFormData(json: Record<string, unknown>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(json)) {
    if (value !== undefined && value !== null) form.append(key, String(value));
  }
  return form;
}

interface ForwardOptions {
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** Bearer token to send; omit for public endpoints. */
  token?: string;
  /** Send the JSON body from the browser as multipart/form-data. */
  multipart?: boolean;
  query?: Record<string, string>;
}

export type Forwarded = { ok: true; status: number; payload: ApiResponse<unknown> } | { ok: false; response: NextResponse };

/** Forwards the incoming request to the backend and parses the standard envelope. */
export async function forward(request: Request, { path, method = "POST", token, multipart, query }: ForwardOptions): Promise<Forwarded> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": request.headers.get("accept-language")?.slice(0, 2) || "ar",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (method === "POST" || method === "PUT") {
    const raw = await request.text();
    let json: Record<string, unknown> = {};
    try {
      json = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      return { ok: false, response: failure(400) };
    }
    if (multipart) {
      // PHP doesn't parse multipart bodies on PUT, so spoof the method on a POST instead.
      if (method === "PUT") {
        json._method = "PUT";
        method = "POST";
      }
      body = toFormData(json); // fetch sets the multipart boundary header itself
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(json);
    }
  }

  const url = new URL(backendUrl(path));
  for (const [k, v] of Object.entries(query ?? {})) url.searchParams.set(k, v);

  let upstream: Response;
  try {
    upstream = await fetch(url, { method, headers, body, cache: "no-store" });
  } catch (error) {
    // Backend unreachable (DNS, refused connection, ...): say why in the server log.
    const cause = error instanceof Error && error.cause instanceof Error ? error.cause.message : String(error);
    console.error(`[bff] ${method} ${url} failed: ${cause}. Check API_BASE_URL in .env.`);
    return { ok: false, response: failure(502) };
  }
  const payload = (await upstream.json().catch(() => null)) as ApiResponse<unknown> | null;
  if (!payload) return { ok: false, response: failure(upstream.status || 502) };
  return { ok: true, status: upstream.status, payload };
}

/** Plain pass-through response; a 401 on an authenticated call means the session is gone. */
export function relay(result: Extract<Forwarded, { ok: true }>, authenticated: boolean) {
  const res = NextResponse.json(result.payload, { status: result.status });
  if (authenticated && result.status === 401) clearSessionCookies(res);
  return res;
}
