export type SupplierStatus =
  | "active"
  | "inactive";

export interface Supplier {

  id?: string;

  name: string;

  contactPerson: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  province: string;

  postalCode: string;

  vatNumber: string;

  paymentTerms: string;

  notes: string;

  status: SupplierStatus;

  totalOrders: number;

  totalSpent: number;

  createdAt?: any;

  updatedAt?: any;

}
