export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error";

export interface AppNotification {

  id: string;

  title: string;

  message: string;

  type: NotificationType;

  module: string;

  link?: string;

  read: boolean;

  createdAt: any;

}
