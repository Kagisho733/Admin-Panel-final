import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { navigation } from "../data/navigation";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Sidebar() {

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const routeMap: Record<string, string> = {
    Dashboard: "/dashboard",
    Products: "/products",
    Categories: "/categories",
    Orders: "/orders",
    Customers: "/customers",
    Users: "/users",
    Inventory: "/inventory",
    Suppliers: "/suppliers",
    Purchasing: "/purchasing",
    Finance: "/finance",
    Analytics: "/analytics",
    Reports: "/reports",
    Notifications: "/notifications",
    "Audit Logs": "/audit-logs",
    Company: "/company",
    Settings: "/settings",
    

  };

  return (
    <>
      {/* Mobile Button */}

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-5 left-5 z-50 lg:hidden bg-blue-600 text-white p-3 rounded-lg shadow-lg"
      >
        <FaBars />
      </button>

      {/* Overlay */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          w-72
          bg-slate-900
          text-white
          transform
          transition-transform
          duration-300
          z-40

          ${mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* Logo */}

        <div className="p-6 border-b border-slate-700">

          <h1 className="text-2xl font-bold">

            📚 Books • Bots

          </h1>

          <p className="text-gray-400 mt-2">

            Admin Dashboard

          </p>

        </div>

        {/* Navigation */}

        <nav className="p-4 pb-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto">

          {navigation
            .filter((item) =>
              user?.role
                ? item.allowedRoles.includes(user.role)
                : false
            )
            .map((item) => {

              const Icon = item.icon;

              return (

                <button
                  key={item.name}
                  onClick={async () => {

                    if (item.name === "Logout") {

                      const confirmed = window.confirm(
                        "Are you sure you want to log out?"
                      );

                      if (!confirmed) {
                        return;
                      }

                      await logout();

                      toast.success("Logged out successfully.");

                      navigate("/login", { replace: true });

                      return;

                    }

                    navigate(routeMap[item.name]);

                    setMobileOpen(false);

                  }}
                  className={`
                  flex
                  items-center
                  gap-4
                  w-full
                  p-4
                  rounded-xl
                  mb-2
                  transition

                  ${location.pathname === routeMap[item.name]
                      ? "bg-blue-600"
                      : "hover:bg-slate-800"
                    }
                `}
                >

                  <Icon size={20} />

                  {item.name}

                </button>

              );

            })}

        </nav>

      </aside>
    </>
  );
}