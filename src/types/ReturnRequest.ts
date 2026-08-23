export type ReturnStatus = "requested" | "approved" | "rejected" | "received" | "refunded";
export type RefundStatus = "not_started" | "completed";

export interface ReturnRequest {
  id: string;
  orderId: string;
  uid: string;
  reason: string;
  details?: string;
  status: ReturnStatus;
  refundStatus: RefundStatus;
  adminNote?: string;
  requestedAt: string;
  updatedAt: string;
}
