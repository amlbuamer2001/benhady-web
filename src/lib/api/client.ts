import axios from "axios";
import { toApiError } from "./api-error";
import type { ApiResponse } from "./types";

/**
 * Browser-side HTTP client. It talks to our own Next.js route handlers (`/api/*`),
 * which proxy to the backend and keep the access token in an httpOnly cookie.
 */
export const http = axios.create({
  baseURL: "/api",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  timeout: 20_000,
});

http.interceptors.request.use((config) => {
  config.headers.set("Accept-Language", document.documentElement.lang || "ar");
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);

export async function post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
  const { data } = await http.post<ApiResponse<T>>(url, body);
  return data;
}

export async function del<T>(url: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const { data } = await http.delete<ApiResponse<T>>(url, { params });
  return data;
}
