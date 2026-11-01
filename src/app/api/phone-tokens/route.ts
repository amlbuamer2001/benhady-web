import { failure, forward, readToken, relay } from "@/lib/api/bff";

/** Save the device's FCM token: POST phone-tokens (multipart, authenticated). */
export async function POST(request: Request) {
  const token = readToken(request);
  if (!token) return failure(401);
  const result = await forward(request, { path: "phone-tokens", token, multipart: true });
  return result.ok ? relay(result, true) : result.response;
}

/** Remove the device's FCM token: DELETE phone-tokens?phone_token=... (authenticated). */
export async function DELETE(request: Request) {
  const token = readToken(request);
  if (!token) return failure(401);
  const phoneToken = new URL(request.url).searchParams.get("phone_token");
  if (!phoneToken) return failure(422);
  const result = await forward(request, { path: "phone-tokens", method: "DELETE", token, query: { phone_token: phoneToken } });
  return result.ok ? relay(result, true) : result.response;
}
