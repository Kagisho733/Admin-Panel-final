/*
|--------------------------------------------------------------------------
| Notification Service
|--------------------------------------------------------------------------
| System notifications raised by the different modules of the panel.
|--------------------------------------------------------------------------
*/

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  limit,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { AppNotification }
from "../types/Notification";

const notificationsCollection = collection(
  db,
  "notifications"
);

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

export async function getNotifications(): Promise<AppNotification[]> {

  const q = query(
    notificationsCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<AppNotification, "id">),
  }));

}

/*
|--------------------------------------------------------------------------
| Subscribe To Notifications
|--------------------------------------------------------------------------
| Returns the unsubscribe function so components can clean up on unmount.
|--------------------------------------------------------------------------
*/

export function subscribeToNotifications(
  onChange: (notifications: AppNotification[]) => void,
  max = 30
) {

  const q = query(
    notificationsCollection,
    orderBy("createdAt", "desc"),
    limit(max)
  );

  return onSnapshot(
    q,
    (snapshot) => {

      onChange(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<AppNotification, "id">),
        }))
      );

    },
    (error) => {

      console.error(
        "Failed to subscribe to notifications:",
        error
      );

    }
  );

}

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
| Never throws, so a notification failure can never break a user action.
|--------------------------------------------------------------------------
*/

export async function createNotification(
  notification: Omit<AppNotification, "id" | "read" | "createdAt">
): Promise<void> {

  try {

    await addDoc(notificationsCollection, {

      ...notification,

      read: false,

      createdAt: new Date(),

    });

  } catch (error) {

    console.error(
      "Failed to create notification:",
      error
    );

  }

}

/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {

  await updateDoc(
    doc(
      db,
      "notifications",
      notificationId
    ),
    {
      read: true,
    }
  );

}

/*
|--------------------------------------------------------------------------
| Mark All Notifications As Read
|--------------------------------------------------------------------------
*/

export async function markAllNotificationsAsRead(
  notifications: AppNotification[]
): Promise<void> {

  await Promise.all(
    notifications
      .filter(notification => !notification.read)
      .map(notification =>
        markNotificationAsRead(notification.id)
      )
  );

}

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export async function deleteNotification(
  notificationId: string
): Promise<void> {

  await deleteDoc(
    doc(
      db,
      "notifications",
      notificationId
    )
  );

}
