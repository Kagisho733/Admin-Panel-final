import { useEffect, useMemo, useState } from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppNotification } from "../types/Notification";
import { subscribeToNotifications } from "../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "../hooks/useAuth";
import { adminNavigation, adminPageTitles } from "../data/navigation";

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const results = useMemo(() => query.trim() ? adminNavigation.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())) : [], [query]);
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => subscribeToNotifications(setNotifications), []);

  return <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="mx-auto flex min-h-20 max-w-[1600px] items-center justify-between gap-4 px-4 pl-20 sm:px-6 lg:px-8">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Administration</p><h1 className="text-xl font-black tracking-tight text-slate-950">{adminPageTitles[location.pathname] || "Control Centre"}</h1></div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden md:block">
          <FaSearch className="pointer-events-none absolute left-3 top-3.5 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {if (event.key === "Enter" && results[0]) {navigate(results[0].path); setQuery("");}}} placeholder="Find a section..." className="w-64 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10" aria-label="Search admin sections" />
          {results.length > 0 && <div className="absolute right-0 mt-2 w-full overflow-hidden rounded-xl border bg-white p-1 shadow-xl">{results.map((item) => <button key={item.path} onClick={() => {navigate(item.path); setQuery("");}} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-blue-50">{item.label}</button>)}</div>}
        </div>
        <div className="relative">
          <button onClick={() => setNotificationsOpen((open) => !open)} className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-600" aria-label={`${unreadCount} unread notifications`}><FaBell />{unreadCount > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-center text-xs font-bold text-white">{unreadCount}</span>}</button>
          {notificationsOpen && <NotificationDropdown notifications={notifications} onClose={() => setNotificationsOpen(false)} />}
        </div>
        <div className="hidden items-center gap-3 border-l border-slate-200 pl-3 sm:flex"><FaUserCircle className="text-4xl text-slate-700" /><div className="max-w-44"><p className="truncate text-sm font-bold text-slate-900">{user?.displayName || "Administrator"}</p><p className="truncate text-xs text-slate-500">{user?.email}</p></div></div>
      </div>
    </div>
  </header>;
}
