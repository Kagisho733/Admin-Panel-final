import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return <div className="admin-shell min-h-screen">
    <Sidebar />
    <div className="min-w-0 lg:pl-72">
      <Topbar />
      <main className="mx-auto w-full max-w-[1600px] p-4 pt-6 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  </div>;
}
