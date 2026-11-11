import { clearSessionCookies, failure, forward, readToken, relay, setUserCookie } from "@/lib/api/bff";
import type { AuthUser } from "@/lib/api/types";

interface ActionConfig {
  /** Backend path. */
  path: string;
  method?: "POST" | "PUT" | "DELETE";
  /** Backend expects multipart/form-data (per the API docs). */
  multipart?: boolean;
  /** Response carries the updated user: refresh the display-name cookie. */
  refreshesUser?: boolean;
  /** Clear the session cookies on success. */
  endsSession?: boolean;
}

// Every profile section (basic info, phone, licence, identity, password) goes through `PUT user/profile`;
// all its fields are optional, so each form sends only its own.
const updateProfile: ActionConfig = { path: "user/profile", method: "PUT", multipart: true, refreshesUser: true };

// Keep in sync with profile.service.ts.
const ACTIONS: Record<string, ActionConfig> = {
  update: updateProfile,
  "update-phone": updateProfile,
  "update-license": updateProfile,
  "update-identity": updateProfile,
  "change-password": updateProfile,
  delete: { path: "auth/account", method: "DELETE", endsSession: true },
};

/** Authenticated BFF proxy: attaches the bearer token from the httpOnly cookie. */
export async function POST(request: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  const config = ACTIONS[action];
  if (!config) return failure(404);

  const token = readToken(request);
  if (!token) return failure(401);

  const result = await forward(request, { path: config.path, method: config.method, multipart: config.multipart, token });
  if (!result.ok) return result.response;

  const res = relay(result, true);
  const ok = result.status < 300;
  const data = result.payload.data as { user?: Partial<AuthUser> } | Partial<AuthUser> | null;
  const user = data && "user" in data ? data.user : (data as Partial<AuthUser> | null);
  if (config.refreshesUser && ok && user?.id && user.name) setUserCookie(res, { id: user.id, name: user.name });
  if (config.endsSession && ok) clearSessionCookies(res);
  return res;
}
