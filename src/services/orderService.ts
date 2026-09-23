import type { Order, OrderStatus } from "../types/Order";
import { apiDownload, apiRequest } from "./api/client";

interface ApiOrder {
  id: string; email: string; items: Order["items"];
  shippingAddress?: {fullName?: string; phone?: string};
  total: number; status: OrderStatus; paymentStatus?: Order["paymentStatus"];
  notes?: string; createdAt?: string; updatedAt?: string;
  subtotal?:number;shippingFee?:number;tax?:number;paymentReference?:string;paymentMethod?:string;courier?:string;trackingNumber?:string;trackingUrl?:string;estimatedDeliveryAt?:string;cancellationReason?:string;refundRequired?:boolean;statusHistory?:Order["statusHistory"];shipping?:Order["shipping"];
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
  shippingAddress: order.shippingAddress as Order["shippingAddress"], shipping:order.shipping, subtotal:order.subtotal,shippingFee:order.shippingFee,tax:order.tax,paymentReference:order.paymentReference,paymentMethod:order.paymentMethod,courier:order.courier,trackingNumber:order.trackingNumber,trackingUrl:order.trackingUrl,estimatedDeliveryAt:order.estimatedDeliveryAt,cancellationReason:order.cancellationReason,refundRequired:order.refundRequired,statusHistory:order.statusHistory,
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

export type FinancialDocumentType = "sales_invoice"|"sales_receipt"|"credit_note"|"refund_confirmation";
export interface FinancialDocument {id:string;number:string;type:FinancialDocumentType;orderId:string;amount:number;currency:string;issuedAt:string;reason?:string}

export async function getOrderDocuments(orderId:string) {
  return (await apiRequest<{documents:FinancialDocument[]}>(`/orders/${orderId}/documents`)).documents;
}

export async function downloadOrderDocument(orderId:string, document:FinancialDocument) {
  return apiDownload(`/orders/${orderId}/documents/${document.id}/pdf`, `${document.number}.pdf`);
}

export async function confirmPayOnDelivery(orderId:string, method:"cash"|"card"|"eft", reference?:string) {
  return apiRequest(`/orders/${orderId}/pay-on-delivery/confirm`, {method:"POST",body:JSON.stringify({method,reference})});
}

export async function issueCreditNote(orderId:string, amount:number, reason:string, correctionReference:string) {
  return apiRequest(`/orders/${orderId}/credit-notes`, {method:"POST",body:JSON.stringify({amount,reason,correctionReference})});
}

export async function recordOrderRefund(orderId:string, amount:number, reason:string, providerReference:string) {
  return apiRequest(`/orders/${orderId}/refunds`, {method:"POST",body:JSON.stringify({amount,reason,providerReference})});
}
