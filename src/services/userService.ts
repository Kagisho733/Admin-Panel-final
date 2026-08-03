import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { User } from "../types/User";

import { logAudit } from "./auditLogService";

const usersCollection =
  collection(db, "users");

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export async function getUsers(): Promise<User[]> {

  const snapshot =
    await getDocs(usersCollection);

  return snapshot.docs.map((doc) => ({

    id: doc.id,

    ...(doc.data() as Omit<User, "id">),

  }));

}

export async function updateUser(
  userId: string,
  user: User,
  performedBy: string = "Unknown"
): Promise<void> {

  const userRef = doc(
    db,
    "users",
    userId
  );

  await updateDoc(userRef, {

    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,

  });

  await logAudit({

    action: "update",

    module: "users",

    entityId: userId,

    entityName: `${user.firstName} ${user.lastName}`,

    description:
      `User "${user.email}" was updated (role: ${user.role}).`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Delete User
|--------------------------------------------------------------------------
*/

export async function deleteUser(
  userId: string,
  performedBy: string = "Unknown",
  userName: string = ""
): Promise<void> {

  const userRef = doc(
    db,
    "users",
    userId
  );

  await deleteDoc(userRef);

  await logAudit({

    action: "delete",

    module: "users",

    entityId: userId,

    entityName: userName,

    description: `User "${userName || userId}" was deleted.`,

    performedBy,

  });

}