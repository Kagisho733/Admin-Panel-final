import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import type { AuthUser } from "../types/AuthUser";
import { clearAdminSession, saveAdminSession, type AdminSession } from "./api/session";

interface UserProfile {
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  active?: boolean;
}

async function createAdminSession(user: FirebaseUser): Promise<AdminSession> {
  const profileSnapshot = await getDoc(doc(db, "users", user.uid));
  const profile = profileSnapshot.data() as UserProfile | undefined;

  if (!profileSnapshot.exists() || profile?.role !== "admin" || profile.active === false) {
    await signOut(auth);
    clearAdminSession();
    throw new Error("This account does not have active administrator access");
  }

  const tokenResult = await user.getIdTokenResult(true);
  const displayName = profile.name
    || [profile.firstName, profile.lastName].filter(Boolean).join(" ")
    || user.displayName
    || user.email
    || "Administrator";
  const authUser: AuthUser = {
    uid: user.uid,
    email: user.email || "",
    displayName,
    role: "admin",
  };
  const session: AdminSession = {
    token: tokenResult.token,
    refreshToken: user.refreshToken,
    expiresAt: new Date(tokenResult.expirationTime).getTime(),
    user: authUser,
  };
  saveAdminSession(session);
  return session;
}

function waitForFirebaseUser(): Promise<FirebaseUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}

export async function login(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const session = await createAdminSession(credential.user);
  return session.user;
}

export async function restoreSession() {
  const user = auth.currentUser || await waitForFirebaseUser();
  if (!user) {
    clearAdminSession();
    return null;
  }

  const session = await createAdminSession(user);
  return session.user;
}

export async function logout() {
  clearAdminSession();
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}
