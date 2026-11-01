import "server-only";
import { cookies } from "next/headers";
import type { AuthUser } from "@/lib/api/types";
import { TOKEN_COOKIE, USER_COOKIE } from "./constants";

export interface Session {
  token: string;
  user: Pick<AuthUser, "id" | "name"> | null;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  let user: Session["user"] = null;
  try {
    const raw = store.get(USER_COOKIE)?.value;
    user = raw ? (JSON.parse(raw) as Session["user"]) : null;
  } catch {
    user = null;
  }
  return { token, user };
}
