/*
|--------------------------------------------------------------------------
| Audit Log Service
|--------------------------------------------------------------------------
| Records every important action performed inside the admin panel.
|--------------------------------------------------------------------------
*/

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { AuditLog } from "../types/AuditLog";

const auditLogsCollection = collection(
  db,
  "auditLogs"
);

/*
|--------------------------------------------------------------------------
| Get Audit Logs
|--------------------------------------------------------------------------
*/

export async function getAuditLogs(): Promise<AuditLog[]> {

  const q = query(
    auditLogsCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<AuditLog, "id">),
  }));

}

/*
|--------------------------------------------------------------------------
| Log Audit Event
|--------------------------------------------------------------------------
| Never throws, so a logging failure can never break a user action.
|--------------------------------------------------------------------------
*/

export async function logAudit(
  log: Omit<AuditLog, "id" | "createdAt">
): Promise<void> {

  try {

    await addDoc(auditLogsCollection, {

      ...log,

      createdAt: new Date(),

    });

  } catch (error) {

    console.error(
      "Failed to write audit log:",
      error
    );

  }

}

/*
|--------------------------------------------------------------------------
| Delete Audit Log
|--------------------------------------------------------------------------
*/

export async function deleteAuditLog(
  logId: string
): Promise<void> {

  await deleteDoc(
    doc(
      db,
      "auditLogs",
      logId
    )
  );

}
