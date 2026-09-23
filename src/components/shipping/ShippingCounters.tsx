import { useEffect, useState } from "react";
import { courierErrorMessage, getCourierCapabilities, getShippingCounters } from "../../services/courierGuyService";
import type { ShippingCounters as Counters } from "../../types/Courier";

export default function ShippingCounters() {
  const [data,setData] = useState<Counters | null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  async function load() {
    setLoading(true); setError(""); setData(null);
    try { const caps = await getCourierCapabilities(); if(caps.counters) setData(await getShippingCounters()); else setError("Shipping counters pending backend integration."); }
    catch(e) { setError(courierErrorMessage(e)); } finally {setLoading(false);}
  }
  useEffect(()=>{void load()},[]);
  return <section aria-busy={loading}><h2 className="mb-4 text-2xl font-black">Shipping overview</h2><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Object.entries({awaitingShipment:"Awaiting shipment",awaitingCollection:"Awaiting collection",inTransit:"In transit",delivered:"Delivered",failed:"Failed shipments"}).map(([key,label])=><div key={key} className="rounded-2xl border bg-white p-5"><p className="text-sm text-slate-600">{label}</p><p className="mt-2 text-3xl font-black">{loading ? "…" : data?.[key as keyof Counters] ?? "—"}</p></div>)}</div>{error && <p className="mt-3 text-sm text-amber-700" role="status">{error} <button disabled={loading} onClick={()=>void load()} className="font-bold underline">Retry</button></p>}</section>;
}
