/*
|--------------------------------------------------------------------------
| Dashboard Header
|--------------------------------------------------------------------------
| Displays the welcome message and business overview.
| Later this can display the logged-in admin's name from Firebase Auth.
|--------------------------------------------------------------------------
*/

import { FaChartLine } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardHeader() {
  const { user } = useAuth();
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-8 shadow-xl">

      <div className="flex flex-col lg:flex-row justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold">

           Welcome Back, {user?.displayName ?? "Administrator"} 👋

          </h1>

          <p className="mt-3 text-blue-100">

            Here's a summary of today's business performance.

          </p>

        </div>

        <div className="mt-6 lg:mt-0">

          <FaChartLine className="text-7xl opacity-70"/>

        </div>

      </div>

    </div>
  );
}