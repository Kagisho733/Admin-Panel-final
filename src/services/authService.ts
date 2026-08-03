import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase/config";



export async function login(

  email: string,

  password: string

) {

  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return credential.user;

}

export async function logout() {

  await signOut(auth);

}

export async function resetPassword(

  email: string

) {

  await sendPasswordResetEmail(
    auth,
    email
  );

}