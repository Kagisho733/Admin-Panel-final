import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";

import type { IconType } from "react-icons";

import type {
  AppNotification,
  NotificationType,
} from "../../types/Notification";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../services/notificationService";

const typeIcons: Record<NotificationType, IconType> = {
  info: FaInfoCircle,
  success: FaCheckCircle,
  warning: FaExclamationTriangle,
  error: FaTimesCircle,
};

const typeStyles: Record<NotificationType, string> = {
  info: "bg-blue-100 text-blue-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-yellow-100 text-yellow-600",
  error: "bg-red-100 text-red-600",
};

export default function NotificationsPage() {

  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("");

  async function loadNotifications() {

    try {

      const data = await getNotifications();

      setNotifications(data);

    } catch (error) {

      console.error(
        "Error loading notifications:",
        error
      );

      toast.error("Failed to load notifications.");

    } finally {

      setLoading(false);

    }

  }

  async function handleOpen(
    notification: AppNotification
  ) {

    try {

      if (!notification.read) {

        await markNotificationAsRead(notification.id);

        await loadNotifications();

      }

    } catch (error) {

      console.error(
        "Failed to mark notification as read:",
        error
      );

    }

    if (notification.link) {

      navigate(notification.link);

    }

  }

  async function handleMarkAll() {

    try {

      await markAllNotificationsAsRead(notifications);

      await loadNotifications();

      toast.success("All notifications marked as read.");

    } catch (error) {

      console.error(
        "Failed to mark notifications as read:",
        error
      );

      toast.error("Failed to update notifications.");

    }

  }

  async function handleDelete(
    notificationId: string
  ) {

    try {

      await deleteNotification(notificationId);

      await loadNotifications();

      toast.success("Notification deleted.");

    } catch (error) {

      console.error(
        "Failed to delete notification:",
        error
      );

      toast.error("Failed to delete notification.");

    }

  }

  useEffect(() => {

    loadNotifications();

  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications = notifications.filter(
    (notification) =>
      filter === ""
        ? true
        : filter === "unread"
          ? !notification.read
          : notification.type === filter
  );

  if (loading) {

    return (

      <div className="p-8">

        Loading notifications...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Notifications

          </h1>

          <p className="mt-2 text-gray-500">

            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}.

          </p>

        </div>

        <div className="flex gap-3">

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-2.5
              shadow-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
            "
          >

            <option value="">All</option>

            <option value="unread">Unread</option>

            <option value="info">Info</option>

            <option value="success">Success</option>

            <option value="warning">Warning</option>

            <option value="error">Error</option>

          </select>

          <button
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              text-white
              transition
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            Mark All As Read
          </button>

        </div>

      </div>

      {filteredNotifications.length === 0 ? (

        <div className="rounded-2xl border bg-white p-12 text-center text-gray-500 shadow-sm">

          No notifications to show.

        </div>

      ) : (

        <div className="space-y-3">

          {filteredNotifications.map((notification) => {

            const Icon = typeIcons[notification.type];

            return (

              <div
                key={notification.id}
                className={`
                  flex
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  p-5
                  shadow-sm
                  transition
                  hover:shadow-md

                  ${notification.read
                    ? "bg-white"
                    : "bg-blue-50/50"
                  }
                `}
              >

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${typeStyles[notification.type]}
                  `}
                >

                  <Icon size={18} />

                </div>

                <button
                  onClick={() => handleOpen(notification)}
                  className="flex-1 text-left"
                >

                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="font-semibold">
                      {notification.title}
                    </h3>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {notification.module}
                    </span>

                  </div>

                  <p className="mt-2 text-gray-600">
                    {notification.message}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">

                    {notification.createdAt?.toDate
                      ? notification.createdAt
                          .toDate()
                          .toLocaleString()
                      : new Date(
                          notification.createdAt
                        ).toLocaleString()}

                  </p>

                </button>

                <button
                  onClick={() =>
                    handleDelete(notification.id)
                  }
                  className="text-gray-400 transition hover:text-red-600"
                >
                  <FaTrash />
                </button>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );

}
