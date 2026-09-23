import type { ShippingAddress } from "./Order";

export interface CourierCapabilities { shipments: boolean; labels: boolean; tracking: boolean; cancellation: boolean; settings: boolean; counters: boolean }
export interface Shipment {
  id: string;
  status: "pending" | "submitted" | "created" | "collected" | "in_transit" | "delivered" | "cancelled" | "failed";
  waybill?: string; service?: string; trackingUrl?: string; estimatedDeliveryAt?: string;
  labelAvailable?: boolean; cost?: number; error?: string; updatedAt?: string;
  parcels?: {weight: number; length: number; width: number; height: number; packaging: string}[];
  events?: {status: string; description: string; timestamp: string}[];
}
export interface CourierOrderShipping { shipment: Shipment | null; ready: boolean; blockers: string[] }
export interface ShippingCounters { awaitingShipment: number; awaitingCollection: number; inTransit: number; delivered: number; failed: number }
export const operatingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export interface CourierSettings {
  collectionAddress: ShippingAddress;
  operatingHours: {day: typeof operatingDays[number]; closed: boolean; opens: string; closes: string}[];
  timezone: string;
}
