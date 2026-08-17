import type { AuthUser } from "../types/AuthUser";
import { apiRequest } from "./api/client";
import {
  clearAdminSession,
  getAdminSession,
  saveAdminSession,
  type AdminSession,
} from "./api/session";

interface BackendUser {
  uid: string;
  email: string;
  name?: string;
  role?: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: string | number;
  user: BackendUser;
}

interface ProfileResponse { user: BackendUser }

const toAuthUser = (user: BackendUser): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.name || user.email,
  role: user.role,
});

const toSession = (response: LoginResponse): AdminSession => ({
  token: response.token,
  refreshToken: response.refreshToken,
  expiresAt: Date.now() + Number(response.expiresIn) * 1000,
  user: toAuthUser(response.user),
});

export async function login(email: string, password: string) {
  const response = await apiRequest<LoginResponse>(
    "/auth/login",
    {method: "POST", body: JSON.stringify({email, password})},
    false
  );
  const session = toSession(response);
  if (session.user.role !== "admin") {
    clearAdminSession();
    throw new Error("This account does not have administrator access");
  }
  saveAdminSession(session);
  return session.user;
}

export async function restoreSession() {
  const current = getAdminSession();
  if (!current) return null;

  let session = current;
  if (current.expiresAt <= Date.now() + 60_000) {
    const refreshed = await apiRequest<LoginResponse>(
      "/auth/refresh",
      {method: "POST", body: JSON.stringify({refreshToken: current.refreshToken})},
      false
    );
    session = toSession(refreshed);
    saveAdminSession(session);
  }

  const profile = await apiRequest<ProfileResponse>("/auth/profile");
  const user = toAuthUser(profile.user);
  if (user.role !== "admin") {
    clearAdminSession();
    return null;
  }
  saveAdminSession({...session, user});
  return user;
}

export async function logout() {
  clearAdminSession();
}

export async function resetPassword(email: string) {
  await apiRequest("/auth/forgot-password", {method: "POST", body: JSON.stringify({email})}, false);
}
