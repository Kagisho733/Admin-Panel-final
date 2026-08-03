export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "export"
  | "status";

export type AuditModule =
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "users"
  | "inventory"
  | "suppliers"
  | "purchasing"
  | "finance"
  | "settings"
  | "auth";

export interface AuditLog {

  id: string;

  action: AuditAction;

  module: AuditModule;

  entityId: string;

  entityName: string;

  description: string;

  performedBy: string;

  createdAt: any;

}
