import { apiRequest } from "./api/client";

export interface DashboardMetrics {
  totalUsers: number;
  totalCategories: number;
  totalProducts: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalCarts: number;
  totalWishlists: number;
  totalPayments: number;
  totalReviews: number;
  totalNotifications: number;
  totalContactMessages: number;
  newMessages: number;
  resolvedMessages: number;
}

export async function getDashboardMetrics() {
  const response = await apiRequest<{dashboard: DashboardMetrics}>("/admin/dashboard");
  return response.dashboard;
}
