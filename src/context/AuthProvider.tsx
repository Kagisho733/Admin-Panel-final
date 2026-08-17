import { useEffect, useState, type ReactNode } from "react";
import type { AuthUser } from "../types/AuthUser";
import { AuthContext } from "./AuthContext";
import { login as loginService, logout as logoutService, restoreSession } from "../services/authService";
import { getAdminSession } from "../services/api/session";
import { ADMIN_SESSION_EXPIRED_EVENT } from "../services/api/client";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      setUser(await restoreSession());
    } catch {
      await logoutService();
      setUser(null);
    }
  }

  useEffect(() => {
    void refreshUser().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const expireSession = () => setUser(null);
    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, expireSession);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, expireSession);
  }, []);

  useEffect(() => {
    if (!user) return;
    const session = getAdminSession();
    if (!session) return;
    const delay = Math.max(session.expiresAt - Date.now() - 60_000, 0);
    const timer = window.setTimeout(() => void refreshUser(), delay);
    return () => window.clearTimeout(timer);
  }, [user]);

  async function login(email: string, password: string) {
    setUser(await loginService(email, password));
  }

  async function logout() {
    await logoutService();
    setUser(null);
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><div className="text-center"><div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"/><p className="mt-5 text-gray-600">Loading Dashboard...</p></div></div>;
  }

  return <AuthContext.Provider value={{user, loading, login, logout, refreshUser}}>{children}</AuthContext.Provider>;
}
