import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardMetrics, type DashboardMetrics } from "../services/adminService";
import { formatCurrency } from "../utils/formatCurrency";
import { FaArrowRight, FaBoxOpen, FaCommentDots, FaCreditCard, FaHeart, FaShoppingCart, FaStar, FaTags, FaUsers } from "react-icons/fa";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [error, setError] = useState("");

  const loadDashboard = () => {
    setError("");
    setMetrics(null);
    void getDashboardMetrics().then(setMetrics).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Dashboard could not be loaded");
    });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700" role="alert"><h2 className="font-bold">Dashboard data is unavailable</h2><p className="mt-1 text-sm">{error}</p><button onClick={loadDashboard} className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">Try again</button></div>;
  if (!metrics) return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="Loading dashboard">{Array.from({length: 8}).map((_, index) => <div key={index} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white/70" />)}</div>;

  const cards = [
    ["Products", metrics.totalProducts, "/products", FaBoxOpen, "Catalogue items"],
    ["Categories", metrics.totalCategories, "/categories", FaTags, "Store departments"],
    ["Orders", metrics.totalOrders, "/orders", FaShoppingCart, "Customer purchases"],
    ["Users", metrics.totalUsers, "/users", FaUsers, "Registered accounts"],
  ] as const;

  const activityCards = [
    ["Contact messages", metrics.totalContactMessages, `${metrics.newMessages} new`, "/contact-messages", FaCommentDots, "bg-orange-50 text-orange-700"],
    ["Reviews", metrics.totalReviews, "Customer feedback", "/reviews", FaStar, "bg-amber-50 text-amber-700"],
    ["Payments", metrics.totalPayments, `${metrics.paidOrders} paid orders`, "/payments", FaCreditCard, "bg-emerald-50 text-emerald-700"],
    ["Active carts", metrics.totalCarts, "Shopping activity", "/carts", FaShoppingCart, "bg-cyan-50 text-cyan-700"],
    ["Wishlists", metrics.totalWishlists, "Saved products", "/wishlists", FaHeart, "bg-rose-50 text-rose-700"],
  ] as const;

  return <div className="space-y-8">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 p-7 text-white shadow-xl sm:p-9"><div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/15 blur-2xl"/><div className="relative"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Live operations</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">Your business at a glance</h1><p className="mt-3 max-w-2xl text-slate-300">Live information from the Books Bots Drones backend. Manage customer activity, content and fulfilment from one place.</p></div><div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur"><p className="text-xs uppercase tracking-wider text-blue-200">System status</p><p className="mt-1 flex items-center gap-2 font-bold"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400"/>Backend connected</p></div></div></div></div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, path, Icon, detail]) => <Link key={label} to={path} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon /></span><FaArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" /></div><p className="mt-5 text-3xl font-black">{value}</p><p className="mt-1 font-semibold">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></Link>)}
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Paid revenue</p><p className="mt-3 text-4xl font-black text-slate-950">{formatCurrency(metrics.totalRevenue)}</p><p className="mt-2 text-sm text-slate-500">Collected from {metrics.paidOrders} paid {metrics.paidOrders === 1 ? "order" : "orders"}</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><h2 className="text-lg font-bold">Fulfilment pipeline</h2><dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><div className="rounded-xl bg-amber-50 p-4"><dt className="text-amber-700">Pending</dt><dd className="mt-1 text-2xl font-black text-amber-700">{metrics.pendingOrders}</dd></div><div className="rounded-xl bg-blue-50 p-4"><dt className="text-blue-700">Processing</dt><dd className="mt-1 text-2xl font-black text-blue-700">{metrics.processingOrders}</dd></div><div className="rounded-xl bg-cyan-50 p-4"><dt className="text-cyan-700">Shipped</dt><dd className="mt-1 text-2xl font-black text-cyan-700">{metrics.shippedOrders}</dd></div><div className="rounded-xl bg-emerald-50 p-4"><dt className="text-emerald-700">Delivered</dt><dd className="mt-1 text-2xl font-black text-emerald-700">{metrics.deliveredOrders}</dd></div></dl></section>
    </div>
    <section><div className="mb-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Store activity</p><h2 className="mt-1 text-2xl font-black text-slate-950">Content, customers and engagement</h2></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{activityCards.map(([label, value, detail, path, Icon, colour]) => <Link key={label} to={path} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${colour}`}><Icon/></span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="font-bold text-slate-900">{label}</p><FaArrowRight className="text-xs text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"/></div><p className="mt-1 text-2xl font-black text-slate-950">{value}</p><p className="text-xs text-slate-500">{detail}</p></div></Link>)}</div></section>
  </div>;
}
