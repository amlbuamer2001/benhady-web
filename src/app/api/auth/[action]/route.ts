import { NextResponse } from "next/server";
import { clearSessionCookies, failure, forward, readToken, relay, setSessionCookies } from "@/lib/api/bff";
import type { AuthUser } from "@/lib/api/types";

interface ActionConfig {
  /** Requires the bearer token stored in the httpOnly cookie. */
  auth?: boolean;
  /** Backend expects multipart/form-data (per the API docs). */
  multipart?: boolean;
  /** Response contains an access token that must be moved into cookies. */
  startsSession?: boolean;
  /** Always clear the session cookies. */
  endsSession?: boolean;
}

const ACTIONS: Record<string, ActionConfig> = {
  login: { startsSession: true },
  "register-step-one": { multipart: true },
  "register-step-two": { multipart: true, startsSession: true },
  "verify-phone": {},
  "resend-phone-otp": { multipart: true },
  "reset-password": { multipart: true },
  logout: { auth: true, endsSession: true },
};

interface SessionPayload {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

export async function POST(request: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  const config = ACTIONS[action];
  if (!config) return failure(404);

  const token = config.auth ? readToken(request) : undefined;
  const result = await forward(request, { path: `auth/${action}`, token, multipart: config.multipart });

  if (!result.ok) {
    if (config.endsSession) clearSessionCookies(result.response);
    return result.response;
  }

  const data = result.payload.data as SessionPayload | null;
  if (config.startsSession && result.status < 300 && data?.access_token) {
    // The token never reaches the browser's JavaScript: strip it from the body, keep it in a cookie.
    const res = NextResponse.json({ ...result.payload, data: { user: data.user } }, { status: result.status });
    setSessionCookies(res, data.access_token, data.user, data.expires_in);
    return res;
  }

  const res = relay(result, !!config.auth);
  if (config.endsSession) clearSessionCookies(res);
  return res;
}
