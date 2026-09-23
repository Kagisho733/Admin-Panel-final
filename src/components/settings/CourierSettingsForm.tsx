import { useEffect, useState } from "react";
import { operatingDays, type CourierSettings } from "../../types/Courier";
import { courierErrorMessage, courierUnavailable, getCourierCapabilities, getCourierSettings, saveCourierSettings } from "../../services/courierGuyService";

const defaults: CourierSettings = {collectionAddress:{fullName:"",phone:"",addressLine1:"",addressLine2:"",city:"",province:"",postalCode:"",country:"ZA"},timezone:"Africa/Johannesburg",operatingHours:operatingDays.map((day,i)=>({day,closed:i>4,opens:"08:00",closes:"17:00"}))};
export default function CourierSettingsForm() {
  const [settings,setSettings] = useState(defaults);
  const [available,setAvailable] = useState(false);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");
  async function load() {
    setPending(true); setAvailable(false); setError(""); setMessage("");
    try {
      const caps = await getCourierCapabilities();
      if(caps.settings) { const result=await getCourierSettings(); setSettings({...defaults,...result,collectionAddress:{...defaults.collectionAddress,...result.collectionAddress},operatingHours:operatingDays.map(day=>result.operatingHours?.find(row=>row.day===day) || defaults.operatingHours.find(row=>row.day===day)!)}); setAvailable(true); }
      else setMessage("Collection settings are pending backend integration.");
    } catch(e) {setError(courierErrorMessage(e));} finally {setPending(false);}
  }
  useEffect(()=>{void load()},[]);
  async function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); if(pending || !available) return;
    setError("");setMessage("");
    if(Object.entries(settings.collectionAddress).some(([key,value])=>key!=="addressLine2"&&!value?.trim())) {setError("Complete all required collection address fields.");return;}
    if(settings.operatingHours.some(row=>!row.closed && (!row.opens || !row.closes || row.opens>=row.closes))) {setError("Each open day must close after its opening time.");return;}
    setPending(true);
    try {await saveCourierSettings(settings);setMessage("Collection settings saved.");} catch(e) {setError(courierErrorMessage(e));if(courierUnavailable(e))setAvailable(false);} finally {setPending(false);}
  }
  return <form onSubmit={save} className="rounded-2xl border bg-white p-6" aria-busy={pending}><h2 className="text-xl font-black">Courier collection settings</h2><p className="mt-2 text-sm text-slate-500">Collection address and operating hours · Africa/Johannesburg</p>
    <fieldset disabled={pending || !available} className="mt-5 space-y-5 disabled:opacity-60"><div className="grid gap-4 md:grid-cols-2">{Object.entries({fullName:"Collection contact",phone:"Phone",addressLine1:"Street address",addressLine2:"Address line 2 (optional)",city:"City",province:"Province",postalCode:"Postal code",country:"Country code"}).map(([key,label])=><label key={key} className="text-sm font-bold">{label}<input required={key!=="addressLine2"} value={settings.collectionAddress[key as keyof typeof settings.collectionAddress] ?? ""} onChange={e=>setSettings({...settings,collectionAddress:{...settings.collectionAddress,[key]:e.target.value}})} className="mt-1 block w-full rounded-lg border p-3"/></label>)}</div>
    <div><h3 className="mb-3 font-bold">Operating hours</h3>{settings.operatingHours.map((row,i)=><div key={row.day} className="mb-3 flex flex-wrap items-center gap-3"><span className="w-24 text-sm font-semibold">{row.day}</span><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={row.closed} onChange={e=>setSettings({...settings,operatingHours:settings.operatingHours.map((r,n)=>n===i?{...r,closed:e.target.checked}:r)})}/>Closed</label>{(["opens","closes"] as const).map(key=><label key={key} className="text-sm">{key === "opens" ? "Opens" : "Closes"}<input aria-label={`${row.day} ${key}`} type="time" required={!row.closed} disabled={row.closed} value={row[key]} onChange={e=>setSettings({...settings,operatingHours:settings.operatingHours.map((r,n)=>n===i?{...r,[key]:e.target.value}:r)})} className="ml-2 rounded-lg border p-2"/></label>)}</div>)}</div><button type="submit" className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">{pending ? "Saving…" : "Save collection settings"}</button></fieldset>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mt-3 text-sm text-slate-600">{message}</p>}{(!available || error) && <button type="button" disabled={pending} onClick={()=>void load()} className="mt-3 font-semibold text-blue-700 disabled:opacity-50">Retry / check availability</button>}
  </form>;
}
