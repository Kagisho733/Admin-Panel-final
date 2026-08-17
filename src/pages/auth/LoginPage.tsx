import { useState } from "react";
import { FaBolt, FaLock, FaEnvelope } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Enter your administrator email and password."); return; }
    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password);
      const from = (location.state as {from?: {pathname?: string}} | null)?.from?.pathname || "/dashboard";
      navigate(from, {replace: true});
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Sign in failed");
    } finally { setLoading(false); }
  }

  return <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
    <section className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,.35),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,.35),transparent_35%)]" />
      <div className="relative flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600"><FaBolt /></span><div><p className="text-xl font-black">Books Bots Drones</p><p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Administration</p></div></div>
      <div className="relative max-w-xl"><p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">One connected operation</p><h1 className="mt-5 text-5xl font-black leading-tight tracking-tight">Manage the catalogue, customers and fulfilment from one secure place.</h1><p className="mt-6 text-lg leading-8 text-slate-300">Changes made here flow through the Firebase backend to the customer storefront.</p></div>
      <p className="relative text-sm text-slate-500">Protected by Firebase Authentication and role-based access.</p>
    </section>
    <section className="flex items-center justify-center bg-slate-50 p-5 sm:p-10">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden"><p className="text-2xl font-black">Books Bots Drones</p><p className="text-blue-600">Administration</p></div>
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-300/40 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Secure access</p><h1 className="mt-3 text-3xl font-black tracking-tight">Welcome back</h1><p className="mt-2 text-slate-500">Sign in with an approved administrator account.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><span className="relative block"><FaEnvelope className="absolute left-4 top-4 text-slate-400" /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="admin@example.com" /></span></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><span className="relative block"><FaLock className="absolute left-4 top-4 text-slate-400" /><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="Your password" /></span></label>
            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</div>}
            <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3.5 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:opacity-60">{loading ? "Signing in..." : "Sign in to dashboard"}</button>
          </form>
        </div>
      </div>
    </section>
  </main>;
}
