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
import {
  clearAdminSession,
  saveAdminSession,
  type AdminSession,
} from "./api/session";

interface UserProfile {
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  active?: boolean;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function getErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    const code = (error as { code?: unknown }).code;

    return typeof code === "string"
      ? code
      : undefined;
  }

  return undefined;

  console.error(
  "[AUTH] Admin authorization failed:",
  {
    code: getErrorCode(error),
    message: describeError(error),
  }
);

}



function mapSignInError(error: unknown): AuthError {
  const code = getErrorCode(error);

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return new AuthError(
        "Invalid email or password."
      );

    case "auth/user-disabled":
      return new AuthError(
        "This account has been disabled."
      );

    case "auth/too-many-requests":
      return new AuthError(
        "Too many login attempts. Please try again later."
      );

    case "auth/network-request-failed":
      return new AuthError(
        "Network error. Please check your internet connection."
      );

    case "auth/operation-not-allowed":
      return new AuthError(
        "Email/password authentication is not enabled."
      );

    case "auth/invalid-email":
      return new AuthError(
        "Please enter a valid email address."
      );

    default:
      return new AuthError(
        "Unable to sign in."
      );
  }
}

async function createAdminSession(
  user: FirebaseUser
): Promise<AdminSession> {
  const profileRef = doc(db, "users", user.uid);

  let profileSnapshot;

  try {
    profileSnapshot = await getDoc(profileRef);
  } catch (error) {
    if (getErrorCode(error) === "permission-denied") {
      throw new AuthError(
        "Firebase authentication succeeded, but Firestore denied access to the administrator profile."
      );
    }

    throw error;
  }

  if (!profileSnapshot.exists()) {
    await signOut(auth).catch(() => undefined);
    clearAdminSession();

    throw new AuthError(
      "Your Firebase account is valid, but no administrator profile exists."
    );
  }

  const profile =
    profileSnapshot.data() as UserProfile;

  const role =
    typeof profile.role === "string"
      ? profile.role.trim().toLowerCase()
      : "";

  if (role !== "admin") {
    await signOut(auth).catch(() => undefined);
    clearAdminSession();

    throw new AuthError(
      "This account does not have administrator access."
    );
  }

  if (profile.active === false) {
    await signOut(auth).catch(() => undefined);
    clearAdminSession();

    throw new AuthError(
      "This administrator account is inactive."
    );
  }

  const tokenResult =
    await user.getIdTokenResult();

  const displayName =
    profile.name ||
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ") ||
    user.displayName ||
    user.email ||
    "Administrator";

  const authUser: AuthUser = {
    uid: user.uid,
    email: user.email ?? "",
    displayName,
    role: "admin",
  };

  const session: AdminSession = {
    token: tokenResult.token,
    expiresAt:
      new Date(
        tokenResult.expirationTime
      ).getTime(),
    user: authUser,
  };

  saveAdminSession(session);

  return session;
}

function waitForFirebaseUser(): Promise<FirebaseUser | null> {
  return new Promise((resolve, reject) => {
    let completed = false;

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (completed) return;

        completed = true;
        unsubscribe();
        resolve(user);
      },
      (error) => {
        if (completed) return;

        completed = true;
        unsubscribe();
        reject(error);
      }
    );
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthUser> {
  const normalizedEmail =
    email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new AuthError(
      "Email address is required."
    );
  }

  if (!password) {
    throw new AuthError(
      "Password is required."
    );
  }

  let credential;

  // -----------------------------
  // STEP 1: Firebase Authentication
  // -----------------------------
  try {
    credential =
      await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );
  } catch (error: unknown) {
    console.error(
      "[AUTH] Firebase sign-in failed:",
      getErrorCode(error)
    );

    clearAdminSession();

    throw mapSignInError(error);
  }

  // -----------------------------
  // STEP 2: Firestore authorization
  // -----------------------------
  try {
    const session =
      await createAdminSession(
        credential.user
      );

    return session.user;
  } catch (error: unknown) {
    console.error(
      "[AUTH] Admin authorization failed:",
      getErrorCode(error)
    );

    clearAdminSession();

    throw error;
  }
}

export async function restoreSession(): Promise<AuthUser | null> {
  try {
    const user =
      auth.currentUser ??
      await waitForFirebaseUser();

    if (!user) {
      clearAdminSession();
      return null;
    }

    const session =
      await createAdminSession(user);

    return session.user;
  } catch (error) {
    console.error(
      "[AUTH] Session restore failed:",
      {
        code: getErrorCode(error),
        message: describeError(error),
      }
    );

    clearAdminSession();

    if (auth.currentUser) {
      await signOut(auth).catch(() => undefined);
    }

    return null;
  }
}

export async function logout(): Promise<void> {
  clearAdminSession();
  await signOut(auth);
}

export async function resetPassword(
  email: string
): Promise<void> {
  const normalizedEmail =
    email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new AuthError(
      "Email address is required."
    );
  }

  await sendPasswordResetEmail(
    auth,
    normalizedEmail
  );
}