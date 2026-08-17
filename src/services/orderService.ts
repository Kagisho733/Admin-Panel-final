import type { Order, OrderStatus } from "../types/Order";
import { apiRequest } from "./api/client";

interface ApiOrder {
  id: string; email: string; items: Order["items"];
  shippingAddress?: {fullName?: string; phone?: string};
  total: number; status: OrderStatus; paymentStatus?: Order["paymentStatus"];
  notes?: string; createdAt?: string; updatedAt?: string;
  subtotal?:number;shippingFee?:number;tax?:number;paymentReference?:string;paymentMethod?:string;courier?:string;trackingNumber?:string;trackingUrl?:string;estimatedDeliveryAt?:string;cancellationReason?:string;refundRequired?:boolean;statusHistory?:Order["statusHistory"];
}

const toOrder = (order: ApiOrder): Order => ({
  id: order.id,
  customerName: order.shippingAddress?.fullName || order.email || "Customer",
  customerEmail: order.email || "",
  customerPhone: order.shippingAddress?.phone || "",
  items: order.items || [],
  totalAmount: Number(order.total) || 0,
  status: order.status,
  paymentStatus: order.paymentStatus,
  notes: order.notes,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  shippingAddress: order.shippingAddress as Order["shippingAddress"], subtotal:order.subtotal,shippingFee:order.shippingFee,tax:order.tax,paymentReference:order.paymentReference,paymentMethod:order.paymentMethod,courier:order.courier,trackingNumber:order.trackingNumber,trackingUrl:order.trackingUrl,estimatedDeliveryAt:order.estimatedDeliveryAt,cancellationReason:order.cancellationReason,refundRequired:order.refundRequired,statusHistory:order.statusHistory,
});

export async function getOrders() {
  const response = await apiRequest<{orders: ApiOrder[]}>("/admin/orders");
  return response.orders.map(toOrder);
}

export async function getOrderById(id: string) {
  const response = await apiRequest<{order: ApiOrder}>(`/orders/${id}`);
  return toOrder(response.order);
}

export interface OrderStatusUpdate {status:OrderStatus;note?:string;notifyCustomer?:boolean;courier?:string;trackingNumber?:string;trackingUrl?:string;estimatedDeliveryAt?:string;cancellationReason?:string}
export async function updateOrderStatus(id: string, update: OrderStatusUpdate) {
  await apiRequest(`/orders/${id}/status`, {method: "PUT", body: JSON.stringify(update)});
}

export async function updateOrdersStatus(ids: string[], status: OrderStatus, performedBy?: string) {
  await Promise.all(ids.map((id) => updateOrderStatus(id, {status,note:`Bulk update by ${performedBy||"administrator"}`})));
}

export async function createOrder(_order: Order, _performedBy?: string): Promise<string> {
  throw new Error("Manual order creation is not supported by the backend");
}

export async function deleteOrder() {
  throw new Error("Order deletion is not supported by the backend");
}

export async function deleteOrders(_ids?: string[], _performedBy?: string) {
  throw new Error("Order deletion is not supported by the backend");
}
