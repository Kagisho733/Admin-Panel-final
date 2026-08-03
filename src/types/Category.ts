export type CategoryStatus =
  | "active"
  | "inactive";

export interface Category {

  id?: string;

  name: string;

  description: string;

  image?: string;

  productCount: number;

  status: CategoryStatus;

  createdAt?: any;

}