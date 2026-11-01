import { clearSessionCookies, failure, forward, readToken, relay, setUserCookie } from "@/lib/api/bff";
import type { AuthUser } from "@/lib/api/types";

interface ActionConfig {
  /** Response carries the updated user: refresh the display-name cookie. */
  refreshesUser?: boolean;
  /** Clear the session cookies on success. */
  endsSession?: boolean;
}

// ASSUMPTION: backend paths are `profile/{action}`; keep in sync with profile.service.ts.
const ACTIONS: Record<string, ActionConfig> = {
  update: { refreshesUser: true },
  "update-phone": { refreshesUser: true },
  "update-license": {},
  "update-identity": {},
  "change-password": {},
  delete: { endsSession: true },
};

/** Authenticated BFF proxy: attaches the bearer token from the httpOnly cookie. */
export async function POST(request: Request, ctx: { params: Promise<{ action: string }> }) {
  const { action } = await ctx.params;
  const config = ACTIONS[action];
  if (!config) return failure(404);

  const token = readToken(request);
  if (!token) return failure(401);

  const result = await forward(request, { path: `profile/${action}`, token });
  if (!result.ok) return result.response;

  const res = relay(result, true);
  const ok = result.status < 300;
  const user = result.payload.data as Partial<AuthUser> | null;
  if (config.refreshesUser && ok && user?.id && user.name) setUserCookie(res, { id: user.id, name: user.name });
  if (config.endsSession && ok) clearSessionCookies(res);
  return res;
}
