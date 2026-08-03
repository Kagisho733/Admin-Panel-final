import {

  useEffect,

  useState,

} from "react";

import type { ReactNode } from "react";

import type { AuthUser } from "../types/AuthUser";

import { AuthContext } from "./AuthContext";

import {

  login as loginService,

  logout as logoutService,

} from "../services/authService";


import {

  onAuthStateChanged,

} from "firebase/auth";

import { auth } from "../firebase/config";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import { logAudit } from "../services/auditLogService";

interface Props {

  children: ReactNode;

}

export default function AuthProvider({

  children,

}: Props) {

  const [

    user,

    setUser,

  ] = useState<AuthUser | null>(null);

  const [

    loading,

    setLoading,

  ] = useState(true);


 async function refreshUser() {
  try {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      setUser(null);
      return;
    }

    const userDoc = await getDoc(
      doc(db, "users", firebaseUser.uid)
    );

    if (!userDoc.exists()) {
      setUser(null);
      return;
    }

    const profile = userDoc.data();

    if (profile.active !== true) {
      setUser(null);
      return;
    }

    setUser({
      uid: firebaseUser.uid,
      email: profile.email,
      displayName: `${profile.firstName} ${profile.lastName}`,
      role: profile.role,
    });

  } catch (error) {
    console.error("Failed to refresh user:", error);
    setUser(null);
  }
}

  useEffect(() => {

    const unsubscribe =

      onAuthStateChanged(

        auth,

     async (firebaseUser) => {

  if (firebaseUser) {

    await refreshUser();

  } else {

    setUser(null);

  }

  setLoading(false);

}

      );

    return unsubscribe;

  }, []);

  async function login(

    email: string,

    password: string

  ) {

    const firebaseUser = await loginService(

      email,

      password

    );

    await logAudit({

      action: "login",

      module: "auth",

      entityId: firebaseUser.uid,

      entityName: email,

      description: `${email} signed in to the admin panel.`,

      performedBy: email,

    });

  }

  async function logout() {

    const currentUser = user;

    /*
    |------------------------------------------------------------------------
    | The audit entry is written before signing out, because once the user
    | is signed out the Firestore rules reject the write.
    |------------------------------------------------------------------------
    */

    if (currentUser) {

      await logAudit({

        action: "logout",

        module: "auth",

        entityId: currentUser.uid,

        entityName: currentUser.email,

        description: `${currentUser.email} signed out.`,

        performedBy: currentUser.email,

      });

    }

    await logoutService();

  }

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center">

    <div className="text-center">

        <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"/>

        <p className="mt-5 text-gray-600">

            Loading Dashboard...

        </p>

    </div>

</div>

    );

  }

  return (

    <AuthContext.Provider

      value={{

        user,

        loading,

        login,

        logout,

        refreshUser,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}