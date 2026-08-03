export type UserRole =
  | "customer"
  | "admin"
  | "manager"
  | "seller"
  | "supplier"
  | "driver"
  | "support";

export interface User {

  id?: string;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  avatar?: string;

  role: UserRole;

  totalOrders: number;

  totalSpent: number;

  createdAt?: any;

}