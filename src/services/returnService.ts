import type { ReturnRequest, ReturnStatus } from "../types/ReturnRequest";
import { apiRequest } from "./api/client";

export async function getReturnRequests() {
  return (await apiRequest<{returns: ReturnRequest[]}>("/orders/returns")).returns;
}

export async function updateReturnRequest(id: string, status: ReturnStatus, note?: string) {
  return apiRequest<{returnRequest: ReturnRequest}>(`/orders/returns/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({status, note}),
  });
}
