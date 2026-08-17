import type { AppNotification, NotificationType } from "../types/Notification";
import { apiRequest } from "./api/client";

interface ApiNotification {
  id: string; title: string; message: string; type: string;
  isRead: boolean; createdAt: string;
}

const toNotification = (item: ApiNotification): AppNotification => ({
  id: item.id,
  title: item.title,
  message: item.message,
  type: (["info", "success", "warning", "error"].includes(item.type) ? item.type : "info") as NotificationType,
  module: "backend",
  read: item.isRead,
  createdAt: item.createdAt,
});

export async function getNotifications() {
  const response = await apiRequest<{notifications: ApiNotification[]}>("/notifications");
  return response.notifications.map(toNotification);
}

export function subscribeToNotifications(callback: (items: AppNotification[]) => void) {
  let active = true;
  const load = () => void getNotifications().then((items) => {
    if (active) callback(items);
  }).catch(() => {
    if (active) callback([]);
  });
  load();
  const timer = window.setInterval(load, 60_000);
  return () => {
    active = false;
    window.clearInterval(timer);
  };
}

export async function createNotification(notification: Partial<AppNotification> & {uid?: string}) {
  await apiRequest("/notifications", {
    method: "POST",
    body: JSON.stringify({
      uid: notification.uid,
      title: notification.title,
      message: notification.message,
      type: notification.type || "info",
    }),
  });
}

export async function markNotificationAsRead(id: string) {
  await apiRequest(`/notifications/${id}/read`, {method: "PUT"});
}

export async function markAllNotificationsAsRead(notifications: AppNotification[]) {
  await Promise.all(notifications.filter((item) => !item.read).map((item) => markNotificationAsRead(item.id)));
}

export async function deleteNotification(id: string) {
  await apiRequest(`/notifications/${id}`, {method: "DELETE"});
}
