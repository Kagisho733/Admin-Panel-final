import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleGuard from "./RoleGuard";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const ProductsPage = lazy(() => import("../pages/products/ProductsPage"));
const CategoriesPage = lazy(() => import("../pages/categories/CategoriesPage"));
const OrdersPage = lazy(() => import("../pages/orders/OrdersPage"));
const UsersPage = lazy(() => import("../pages/users/UsersPage"));
const CollectionPage = lazy(() => import("../pages/collections/CollectionPage"));
const PaymentsPage = lazy(() => import("../pages/activity/PaymentsPage"));
const CustomerActivityPage = lazy(() => import("../pages/activity/CustomerActivityPage"));
const ReviewsPage = lazy(() => import("../pages/reviews/ReviewsPage"));
const PromotionsPage = lazy(() => import("../pages/promotions/PromotionsPage"));
const ReturnsPage = lazy(() => import("../pages/returns/ReturnsPage"));

const loader = <div className="flex min-h-[60vh] items-center justify-center">Loading...</div>;

export default function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return loader;

  return <Suspense fallback={loader}><Routes>
    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
    <Route element={<ProtectedRoute><RoleGuard allowedRoles={["admin"]}><AdminLayout /></RoleGuard></ProtectedRoute>}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/returns" element={<ReturnsPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/contact-messages" element={<CollectionPage collectionName="contactMessages" />} />
      <Route path="/notifications" element={<CollectionPage collectionName="notifications" />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/carts" element={<CustomerActivityPage type="carts" />} />
      <Route path="/wishlists" element={<CustomerActivityPage type="wishlists" />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes></Suspense>;
}
