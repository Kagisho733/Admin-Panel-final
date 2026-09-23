import { ApiError, apiRequest } from "./api/client";
import type { CourierCapabilities, CourierOrderShipping, CourierSettings, Shipment, ShippingCounters } from "../types/Courier";
import type { Order } from "../types/Order";

const root = "/shipping";
const orderPath = (id: string) => `${root}/orders/${encodeURIComponent(id)}`;
export const unavailableCapabilities: CourierCapabilities = {shipments:false, labels:false, tracking:false, cancellation:false, settings:false, counters:false};
export const courierUnavailable = (error: unknown) => error instanceof ApiError && [404,405,501,503].includes(error.status);
export const courierErrorMessage = (error: unknown) => error instanceof Error ? error.message : "Courier request failed. Please retry.";
export async function getCourierCapabilities(): Promise<CourierCapabilities> {
  return {shipments:true, labels:true, tracking:true, cancellation:true, settings:true, counters:true};
}

const asShipping = (order: Order, events?: Shipment["events"]): CourierOrderShipping => {
  const shipping = order.shipping;
  const ready = Boolean(shipping?.serviceName && order.shippingAddress && order.items.every(item => Number(item.weight)>0 && Number(item.length)>0 && Number(item.width)>0 && Number(item.height)>0));
  const blockers = ready ? [] : [!shipping?.serviceName ? "No courier service was selected at checkout." : "Product parcel measurements are incomplete."];
  const shipment: Shipment | null = shipping?.shipmentId ? {id:shipping.shipmentId,status:(shipping.status || "pending") as Shipment["status"],waybill:shipping.trackingReference,service:shipping.serviceName,cost:shipping.quotedAmount,estimatedDeliveryAt:shipping.estimatedDeliveryDate || undefined,labelAvailable:shipping.labelAvailable,events} : null;
  return {ready, blockers, shipment};
};
export async function getOrderShipping(id: string): Promise<CourierOrderShipping> {
  const result = await apiRequest<{order:Order}>(`/orders/${encodeURIComponent(id)}`);
  const state = asShipping(result.order);
  const settings = await getCourierSettings();
  if (!settings.collectionAddress?.addressLine1 || !settings.collectionAddress?.phone) {
    state.ready = false;
    state.blockers.push("Configure the collection address and contact in courier settings.");
  }
  return state;
}
export async function createShipment(id: string, _idempotencyKey: string): Promise<CourierOrderShipping> {
  await apiRequest(`${orderPath(id)}/shipments`, {method:"POST", body:"{}"});
  return getOrderShipping(id);
}
export async function downloadShipmentLabel(id: string): Promise<void> {
  const result = await apiRequest<{url:string}>(`${orderPath(id)}/label`);
  const url = new URL(result.url);
  if (url.protocol !== "https:") throw new Error("Invalid label URL");
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}
export async function refreshShipmentTracking(id: string): Promise<CourierOrderShipping> {
  const result = await apiRequest<{tracking:{events:{status:string;date:string;location?:string}[]}}>(`${orderPath(id)}/tracking`);
  const current = await getOrderShipping(id);
  if (current.shipment) current.shipment.events = result.tracking.events.map(event => ({status:event.status,description:event.location || "",timestamp:event.date}));
  return current;
}
export async function cancelShipment(id: string, _reason: string): Promise<CourierOrderShipping> {
  await apiRequest(`${orderPath(id)}/shipments/cancel`, {method:"POST", body:"{}"});
  return getOrderShipping(id);
}
export async function getShippingCounters(): Promise<ShippingCounters> {
  return (await apiRequest<{counters:ShippingCounters}>(`${root}/counters`)).counters;
}
export async function getCourierSettings(): Promise<CourierSettings> {return (await apiRequest<{settings:CourierSettings}>(`${root}/settings`)).settings;}
export async function saveCourierSettings(settings: CourierSettings): Promise<CourierSettings> {return (await apiRequest<{settings:CourierSettings}>(`${root}/settings`, {method:"PUT",body:JSON.stringify(settings)})).settings;}
