import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

import type { IconType } from "react-icons";

import { useNavigate } from "react-router-dom";

import type {
  AppNotification,
  NotificationType,
} from "../types/Notification";

import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService";

interface Props {
  notifications: AppNotification[];
  onClose: () => void;
}

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

export default function NotificationDropdown({
  notifications,
  onClose,
}: Props) {

  const navigate = useNavigate();

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  async function handleOpen(
    notification: AppNotification
  ) {

    try {

      if (!notification.read) {

        await markNotificationAsRead(notification.id);

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

    onClose();

  }

  async function handleMarkAll() {

    try {

      await markAllNotificationsAsRead(notifications);

    } catch (error) {

      console.error(
        "Failed to mark notifications as read:",
        error
      );

    }

  }

  function formatTime(value: any) {

    if (!value) {

      return "";

    }

    const date =
      typeof value.toDate === "function"
        ? value.toDate()
        : new Date(value);

    if (isNaN(date.getTime())) {

      return "";

    }

    return date.toLocaleString();

  }

  return (
    <div className="absolute right-0 z-50 mt-2 w-96 rounded-xl border bg-white shadow-xl">

      <div className="flex items-center justify-between border-b p-4">

        <span className="font-bold">
          Notifications
        </span>

        {unreadCount > 0 && (

          <button
            onClick={handleMarkAll}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>

        )}

      </div>

      <div className="max-h-96 overflow-y-auto">

        {notifications.length === 0 ? (

          <p className="p-6 text-center text-sm text-gray-500">
            You have no notifications.
          </p>

        ) : (

          notifications.map((notification) => {

            const Icon = typeIcons[notification.type];

            return (

              <button
                key={notification.id}
                onClick={() => handleOpen(notification)}
                className={`
                  flex
                  w-full
                  items-start
                  gap-3
                  border-b
                  p-4
                  text-left
                  transition
                  hover:bg-gray-50

                  ${notification.read
                    ? ""
                    : "bg-blue-50/40"
                  }
                `}
              >

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${typeStyles[notification.type]}
                  `}
                >

                  <Icon size={16} />

                </div>

                <div className="flex-1">

                  <p className="font-semibold">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {formatTime(notification.createdAt)}
                  </p>

                </div>

                {!notification.read && (

                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />

                )}

              </button>

            );

          })

        )}

      </div>

      <button
        onClick={() => {
          navigate("/notifications");
          onClose();
        }}
        className="w-full p-4 text-center text-sm font-medium text-blue-600 hover:bg-gray-50"
      >
        View all notifications
      </button>

    </div>
  );
}
