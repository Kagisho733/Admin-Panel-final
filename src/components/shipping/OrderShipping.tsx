import { useCallback, useEffect, useRef, useState } from "react";
import type { Order } from "../../types/Order";
import type { CourierOrderShipping } from "../../types/Courier";
import * as courier from "../../services/courierGuyService";

export default function OrderShipping({order, onUpdated}: {order: Order; onUpdated: () => Promise<void>}) {
  const [capabilities, setCapabilities] = useState(courier.unavailableCapabilities);
  const [data, setData] = useState<CourierOrderShipping | null>(null);
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const key = useRef(crypto.randomUUID());
  const load = useCallback(async () => {
    setPending("Checking courier availability"); setError(""); setCapabilities(courier.unavailableCapabilities);
    try {
      const caps = await courier.getCourierCapabilities(); setCapabilities(caps);
      if (caps.shipments && order.id) setData(await courier.getOrderShipping(order.id));
    } catch (e) { setError(courier.courierErrorMessage(e)); }
    finally { setPending(""); }
  }, [order.id]);
  useEffect(() => { void load(); }, [load]);
  const shipment = data?.shipment;
  async function run(action: "create" | "label" | "tracking" | "cancel") {
    if (!order.id || pending) return;
    if (action === "cancel" && !window.confirm("Cancel this Courier Guy shipment?")) return;
    setPending(action); setError(""); setNotice("");
    try {
      if (action === "label") await courier.downloadShipmentLabel(order.id);
      else {
        const result = action === "create" ? await courier.createShipment(order.id, key.current) : action === "tracking" ? await courier.refreshShipmentTracking(order.id) : await courier.cancelShipment(order.id, "");
        setData(result);
        try { await onUpdated(); } catch { setNotice("Shipping updated. Reload the orders list to refresh its status."); }
      }
      setNotice(previous => previous || "Courier action completed.");
    } catch (e) { setError(courier.courierErrorMessage(e)); if(courier.courierUnavailable(e)) setCapabilities(courier.unavailableCapabilities); }
    finally { setPending(""); }
  }
  const closed = order.status === "cancelled" || order.status === "delivered";
  const buttons = [
    {action:"create", label:"Create Shipment", enabled:capabilities.shipments && data?.ready && !shipment && !closed},
    {action:"label", label:"Download Label", enabled:capabilities.labels && shipment?.labelAvailable},
    {action:"tracking", label:"Refresh Tracking", enabled:capabilities.tracking && shipment && shipment.status !== "cancelled"},
    {action:"cancel", label:"Cancel Shipment", enabled:capabilities.cancellation && shipment && ["pending","submitted","created","failed"].includes(shipment.status)},
  ] as const;
  const trackingUrl = shipment?.trackingUrl || order.trackingUrl;
  return <section className="rounded-2xl border bg-white p-5 lg:col-span-3" aria-busy={!!pending}>
    <h3 className="text-lg font-black">Shipping</h3>
    <p className="mt-2 text-sm text-slate-600">{pending || (!capabilities.shipments ? "Courier integration pending — backend endpoints are not available." : data?.ready ? "Ready for courier booking" : "Shipping requires attention")}</p>
    {data?.blockers?.length ? <ul className="mt-2 list-inside list-disc text-sm text-amber-700">{data.blockers.map((item,i)=><li key={i}>{item}</li>)}</ul> : null}
    <dl className="my-4 grid gap-3 text-sm sm:grid-cols-3">{Object.entries({Courier:order.courier || "The Courier Guy", Status:shipment?.status || "No shipment", "Shipment ID":shipment?.id, Waybill:shipment?.waybill || order.trackingNumber, Service:shipment?.service, "Estimated delivery":shipment?.estimatedDeliveryAt || order.estimatedDeliveryAt, "Shipping fee":order.shippingFee == null ? undefined : `R ${order.shippingFee.toFixed(2)}`, "Courier cost":shipment?.cost == null ? undefined : `R ${shipment.cost.toFixed(2)}`, "Last updated":shipment?.updatedAt}).map(([label,value])=><div key={label}><dt className="text-slate-500">{label}</dt><dd className="break-words font-semibold">{value || "Not available"}</dd></div>)}</dl>
    {trackingUrl && /^https?:\/\//i.test(trackingUrl) && <a href={trackingUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-700 underline">Open tracking page</a>}
    {shipment?.parcels?.map((parcel,i)=><p key={i} className="mt-2 text-sm">Parcel {i+1}: {parcel.weight} kg · {parcel.length} × {parcel.width} × {parcel.height} cm · {parcel.packaging}</p>)}
    {shipment?.error && <p role="alert" className="mt-3 text-sm text-red-700">Courier error: {shipment.error}</p>}
    <div className="mt-4 flex flex-wrap gap-2">{buttons.map(b=><button key={b.action} disabled={!!pending || !b.enabled} onClick={()=>void run(b.action)} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">{pending===b.action ? "Working…" : b.label}</button>)}</div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error} Recheck shipping before retrying the action.</p>}
    {(!capabilities.shipments || error) && <button disabled={!!pending} onClick={()=>void load()} className="mt-3 text-sm font-bold text-blue-700 disabled:opacity-50">Retry / check availability</button>}
    {notice && <p role="status" className="mt-3 text-sm text-emerald-700">{notice}</p>}
    <h4 className="mt-5 font-bold">Tracking history</h4>{shipment?.events?.length ? <ol className="mt-2 space-y-2">{shipment.events.map((event,i)=><li key={i} className="text-sm"><strong>{event.status}</strong> — {event.description}<span className="ml-2 text-slate-500">{event.timestamp}</span></li>)}</ol> : <p className="mt-2 text-sm text-slate-500">No tracking events available.</p>}
  </section>;
}
