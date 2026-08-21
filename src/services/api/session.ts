import type { AuthUser } from "../../types/AuthUser";

export interface AdminSession {
  token: string;
  expiresAt: number;
  user: AuthUser;
}

const SESSION_KEY =
  "books-bots-drones-admin-session";

export function getAdminSession(): AdminSession | null {
  try {
    const value =
      sessionStorage.getItem(SESSION_KEY);

    if (!value) {
      return null;
    }

    const session =
      JSON.parse(value) as AdminSession;

    if (
      !session.token ||
      !session.user ||
      !session.expiresAt
    ) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    if (Date.now() >= session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveAdminSession(
  session: AdminSession
): void {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}