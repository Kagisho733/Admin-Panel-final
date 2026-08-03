export interface Customer {

  id: string;

  fullName: string;

  email: string;

  phone?: string;

  address?: string;

  city?: string;

  province?: string;

  postalCode?: string;

  tags?: string[];

  totalOrders: number;

  totalSpent: number;

  lastOrderDate?: any;

  createdAt?: any;

}