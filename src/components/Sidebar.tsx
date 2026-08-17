import { useState } from "react";
import { FaBars, FaBolt, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminNavigation, adminSections } from "../data/navigation";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const signOut = async () => {
    await logout();
    toast.success("Signed out safely");
    navigate("/login", {replace: true});
  };

  return <>
    <button onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-50 rounded-xl bg-slate-950 p-3 text-white shadow-lg lg:hidden" aria-label="Open navigation"><FaBars /></button>
    {mobileOpen && <button className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation overlay" />}
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-slate-950 text-white shadow-2xl transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-blue-900/40"><FaBolt /></span>
            <span><span className="block text-lg font-black tracking-tight">Books Bots Drones</span><span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Control Centre</span></span>
          </NavLink>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 lg:hidden" aria-label="Close navigation"><FaTimes /></button>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4" aria-label="Administration">
        {adminSections.map((section) => <div key={section} className="mb-4"><p className="px-3 pb-1.5 pt-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">{section}</p><div className="space-y-0.5">{adminNavigation.filter((item) => item.section === section && user?.role === "admin").map((item) => {
          const Icon = item.icon;
          return <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon size={16} /><span>{item.label}</span></NavLink>;
        })}</div></div>)}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl bg-white/5 p-3"><p className="truncate text-sm font-semibold">{user?.displayName}</p><p className="truncate text-xs text-slate-400">{user?.email}</p></div>
        <button onClick={() => void signOut()} className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300">Sign out</button>
      </div>
    </aside>
  </>;
}
