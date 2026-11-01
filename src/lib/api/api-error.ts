import axios from "axios";

/** Normalized error thrown by the client HTTP layer. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: Record<string, string> = {},
    public readonly isNetwork = false,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function extractFieldErrors(errors: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    for (const [key, value] of Object.entries(errors)) {
      const first = Array.isArray(value) ? value[0] : value;
      if (typeof first === "string") out[key] = first;
    }
  }
  return out;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    if (!error.response) return new ApiError("", 0, {}, true);
    const body = error.response.data as { messages?: string[]; errors?: unknown } | undefined;
    const fieldErrors = extractFieldErrors(body?.errors);
    // The backend sometimes sends a plain list in `errors` (e.g. wrong credentials) with empty `messages`.
    const listed = Array.isArray(body?.errors) ? body.errors.find((e): e is string => typeof e === "string") : undefined;
    const message = body?.messages?.[0] ?? listed ?? Object.values(fieldErrors)[0] ?? "";
    return new ApiError(message, error.response.status, fieldErrors);
  }
  return new ApiError("", 0);
}
