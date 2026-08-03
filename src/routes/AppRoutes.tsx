import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

/*
|--------------------------------------------------------------------------
| Lazy Loaded Pages
|--------------------------------------------------------------------------
| Every page is code split so the browser only downloads the screen it
| actually needs. The guards and the layout stay eager because they render
| on every route.
|--------------------------------------------------------------------------
*/

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const ProductsPage = lazy(() => import("../pages/products/ProductsPage"));
const CategoriesPage = lazy(() => import("../pages/categories/CategoriesPage"));
const OrdersPage = lazy(() => import("../pages/orders/OrdersPage"));
const CustomersPage = lazy(() => import("../pages/customers/CustomersPage"));
const UsersPage = lazy(() => import("../pages/users/UsersPage"));
const AnalyticsPage = lazy(() => import("../pages/analytics/AnalyticsPage"));
const InventoryPage = lazy(() => import("../pages/inventory/InventoryPage"));
const SuppliersPage = lazy(() => import("../pages/suppliers/SuppliersPage"));
const PurchasingPage = lazy(() => import("../pages/purchasing/PurchasingPage"));
const FinancePage = lazy(() => import("../pages/finance/FinancePage"));
const ReportsPage = lazy(() => import("../pages/reports/ReportsPage"));
const NotificationsPage = lazy(() => import("../pages/notifications/NotificationsPage"));
const AuditLogsPage = lazy(() => import("../pages/audit/AuditLogsPage"));
const CompanyPage = lazy(() => import("../pages/company/CompanyPage"));
const SettingsPage = lazy(() => import("../pages/settings/SettingsPage"));

/*
|--------------------------------------------------------------------------
| Page Loader
|--------------------------------------------------------------------------
| Shown while a lazy loaded page chunk is downloading.
|--------------------------------------------------------------------------
*/

function PageLoader() {

    return (

        <div className="flex min-h-[60vh] items-center justify-center">

            <div className="text-center">

                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

                <p className="mt-4 text-gray-500">

                    Loading...

                </p>

            </div>

        </div>

    );

}


export default function AppRoutes() {

    const { user, loading } = useAuth();

    if (loading) {

        return <div>Loading...</div>;

    }

    return (

        <Suspense fallback={<PageLoader />}>

        <Routes>

            <Route
                path="/"
                element={
                    user
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                }
            />

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                element={
                    <ProtectedRoute>
                        <RoleGuard allowedRoles={["admin"]}>
                            <AdminLayout />
                        </RoleGuard>
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/products"
                    element={<ProductsPage />}
                />

                <Route
                    path="/categories"
                    element={<CategoriesPage />}
                />

                <Route
                    path="/orders"
                    element={<OrdersPage />}
                />

                <Route
                    path="/customers"
                    element={<CustomersPage />}
                />

                <Route
                    path="/users"
                    element={<UsersPage />}
                />

                <Route
                    path="/analytics"
                    element={<AnalyticsPage />}
                />

                <Route
                    path="/inventory"
                    element={<InventoryPage />}
                />

                <Route
                    path="/suppliers"
                    element={<SuppliersPage />}
                />

                <Route
                    path="/purchasing"
                    element={<PurchasingPage />}
                />

                <Route
                    path="/finance"
                    element={<FinancePage />}
                />

                <Route
                    path="/reports"
                    element={<ReportsPage />}
                />

                <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                />

                <Route
                    path="/audit-logs"
                    element={<AuditLogsPage />}
                />

                <Route
                    path="/company"
                    element={<CompanyPage />}
                />

                <Route
                    path="/settings"
                    element={<SettingsPage />}
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Route>

        </Routes>

        </Suspense>

    );

}