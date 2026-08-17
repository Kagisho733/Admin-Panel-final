import { useCallback, useEffect, useMemo, useState } from "react";
import { FaDatabase, FaRedo, FaSearch } from "react-icons/fa";
import { ApiError } from "../../services/api/client";
import { getCollectionRecords, type AdminCollectionName, type CollectionRecord } from "../../services/collectionService";

const settings: Record<AdminCollectionName, {title: string; description: string; fields: string[]}> = {
  carts: {title: "Carts", description: "Read-only customer shopping cart activity.", fields: ["uid", "items", "subtotal", "updatedAt", "createdAt"]},
  contactMessages: {title: "Contact Messages", description: "Questions and support requests received from the storefront.", fields: ["name", "email", "subject", "status", "createdAt"]},
  notifications: {title: "Notifications", description: "Customer and administrative system notifications.", fields: ["title", "message", "type", "read", "createdAt"]},
  payments: {title: "Payments", description: "Read-only payment references and verification status.", fields: ["reference", "uid", "amount", "status", "createdAt"]},
  reviews: {title: "Reviews", description: "Customer ratings and product feedback.", fields: ["productId", "uid", "rating", "comment", "createdAt"]},
  wishlists: {title: "Wishlists", description: "Read-only products saved by customers.", fields: ["uid", "items", "updatedAt", "createdAt"]},
};

const supported = new Set(Object.keys(settings));
const displayValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  if (typeof value === "object") return "View record";
  const text = String(value);
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
};

export default function CollectionPage({collectionName}: {collectionName: AdminCollectionName}) {
  const name = supported.has(collectionName) ? collectionName : "notifications";
  const config = settings[name];
  const [records, setRecords] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setRecords((await getCollectionRecords(name)).records); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : `Could not load ${config.title.toLowerCase()}.`); }
    finally { setLoading(false); }
  }, [config.title, name]);

  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => records.filter((record) => JSON.stringify(record).toLowerCase().includes(query.toLowerCase())), [records, query]);

  return <section className="space-y-6">
    <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 p-7 text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Firestore collection</p><h2 className="text-3xl font-black">{config.title}</h2><p className="mt-2 max-w-2xl text-blue-100">{config.description}</p></div><div className="rounded-2xl bg-white/10 px-5 py-4 text-center backdrop-blur"><p className="text-3xl font-black">{records.length}</p><p className="text-xs uppercase tracking-wider text-blue-200">Records</p></div></div>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div className="relative min-w-64 flex-1"><FaSearch className="absolute left-3 top-3.5 text-slate-400"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`} className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"/></div><button onClick={() => void load()} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"><FaRedo/> Refresh</button></div></div>
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>}
    {!error && <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {loading ? <div className="space-y-3 p-8">{Array.from({length: 4}).map((_, index) => <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-100"/>)}</div> : filtered.length === 0 ? <div className="grid place-items-center gap-3 p-12 text-center text-slate-500"><FaDatabase className="text-4xl text-slate-300"/><p>{query ? "No matching records found." : `No ${config.title.toLowerCase()} have been created yet.`}</p></div> : <div className="overflow-x-auto"><table className="w-full"><thead><tr>{config.fields.map((field) => <th key={field}>{field.replace(/([A-Z])/g, " $1")}</th>)}</tr></thead><tbody>{filtered.map((record) => <tr key={record.id}>{config.fields.map((field) => <td key={field} title={String(record[field] ?? "")}>{displayValue(record[field])}</td>)}</tr>)}</tbody></table></div>}
    </div>}
  </section>;
}
