export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "partially-paid"
  | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;

  customerName: string;
  customerEmail: string;

  items: OrderItem[];

  totalAmount: number;

  status: OrderStatus;

  paymentStatus?: PaymentStatus;

  customerPhone?: string;

  notes?: string;

  createdBy?: string;

  createdAt?: any;

  updatedAt?: any;
}