export interface Analytics {

  totalRevenue: number;
  monthlyRevenue: number;

  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyOrders: number;

  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;

  totalUsers: number;
  adminUsers: number;
  customerUsers: number;

  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;

}