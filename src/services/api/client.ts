import { clearAdminSession, getAdminSession } from "./session";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export const ADMIN_SESSION_EXPIRED_EVENT = "admin-session-expired";

interface ApiErrorBody {
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true
): Promise<T> {
  if (!API_URL) throw new ApiError(500, "VITE_API_URL is not configured");

  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const session = getAdminSession();
  if (authenticated && session?.token) headers.set("Authorization", `Bearer ${session.token}`);

  const response = await fetch(`${API_URL}${path}`, {...options, headers});
  const body = await response.json().catch(() => ({})) as ApiErrorBody;

  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      clearAdminSession();
      window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
    }
    throw new ApiError(response.status, body.message || body.error || `Request failed (${response.status})`);
  }

  return body as T;
}

export async function apiDownload(path: string, filename: string): Promise<void> {
  if (!API_URL) throw new ApiError(500, "VITE_API_URL is not configured");
  const headers = new Headers();
  const session = getAdminSession();
  if (session?.token) headers.set("Authorization", `Bearer ${session.token}`);
  const response = await fetch(`${API_URL}${path}`, {headers});
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as ApiErrorBody;
    throw new ApiError(response.status, body.message || body.error || `Request failed (${response.status})`);
  }
  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
