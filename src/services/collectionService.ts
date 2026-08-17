import { apiRequest } from "./api/client";

export type AdminCollectionName = "carts" | "contactMessages" | "notifications" | "payments" | "reviews" | "wishlists";
export type CollectionRecord = Record<string, unknown> & {id: string};

export async function getCollectionRecords(collection: AdminCollectionName) {
  return apiRequest<{collection: AdminCollectionName; count: number; records: CollectionRecord[]}>(`/admin/collections/${collection}`);
}
