export type CategoryStatus =
  | "active"
  | "inactive";

export interface Category {

  id?: string;

  name: string;

  description: string;

  storefrontDescription: string;

  image?: string;

  displayOrder: number;

  showOnHomepage: boolean;

  productCount: number;

  status: CategoryStatus;

  createdAt?: any;

}
