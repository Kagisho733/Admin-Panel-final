import type { AuthUser } from "../../types/AuthUser";

export interface AdminSession {
  token: string;
  refreshToken: string;
  expiresAt: number;
  user: AuthUser;
}

const SESSION_KEY = "books-bots-drones-admin-session";

export function getAdminSession(): AdminSession | null {
  try {
    const value = sessionStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as AdminSession : null;
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
