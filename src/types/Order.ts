export type OrderStatus =
  | "pending"
  | "paid"
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
  imageUrl?: string;
  lineTotal?: number;
}

export interface ShippingAddress {fullName:string;phone:string;addressLine1:string;addressLine2?:string;city:string;province?:string;postalCode?:string;country:string}
export interface OrderHistoryEntry {from:OrderStatus;to:OrderStatus;note?:string;actorEmail?:string;createdAt:string}

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
  subtotal?: number; shippingFee?: number; tax?: number;
  shippingAddress?: ShippingAddress;
  paymentReference?: string; paymentMethod?: string;
  courier?: string; trackingNumber?: string; trackingUrl?: string; estimatedDeliveryAt?: string;
  cancellationReason?: string; refundRequired?: boolean;
  statusHistory?: OrderHistoryEntry[];
}
