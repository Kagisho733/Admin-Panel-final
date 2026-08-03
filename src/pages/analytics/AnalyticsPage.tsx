import { useEffect, useState } from "react";

import type { Analytics } from "../../types/Analytics";

import { getAnalytics } from "../../services/analyticsService";

import AnalyticsGrid from "../../components/analytics/AnalyticsGrid";
import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import RevenueChart from "../../components/analytics/charts/RevenueChart";
import OrdersChart from "../../components/analytics/charts/OrdersChart";
import ProductsChart from "../../components/analytics/charts/ProductsChart";
import UsersChart from "../../components/analytics/charts/UsersChart";
import CategoriesChart from "../../components/analytics/charts/CategoriesChart";


export default function AnalyticsPage() {

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadAnalytics() {

    try {

      const data = await getAnalytics();

      setAnalytics(data);

    } catch (error) {

      console.error(
        "Error loading analytics:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadAnalytics();

  }, []);

  if (loading) {

    return (

      <div className="text-center py-20">

        Loading Analytics...

      </div>

    );

  }

  if (!analytics) {

    return (

      <div className="text-center py-20">

        Unable to load analytics.

      </div>

    );

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Analytics Dashboard

        </h1>

        <p className="mt-2 text-gray-500">

          Monitor your business performance.

        </p>

      </div>

      <AnalyticsGrid>

        <AnalyticsCard
          title="Revenue"
          value={`R${analytics.totalRevenue.toLocaleString()}`}
          subtitle="Total Revenue"
        />

        <AnalyticsCard
          title="Orders"
          value={analytics.totalOrders}
          subtitle="Total Orders"
        />

        <AnalyticsCard
          title="Products"
          value={analytics.totalProducts}
          subtitle="Products Available"
        />

        <AnalyticsCard
          title="Users"
          value={analytics.totalUsers}
          subtitle="Registered Users"
        />

      </AnalyticsGrid>


      <AnalyticsCard
        title="Pending Orders"
        value={analytics.pendingOrders}
        subtitle="Awaiting Processing"
      />

      <AnalyticsCard
        title="Completed Orders"
        value={analytics.completedOrders}
        subtitle="Successfully Delivered"
      />


      <AnalyticsCard
        title="Active Products"
        value={analytics.activeProducts}
        subtitle="Currently Selling"
      />

      <AnalyticsCard
        title="Low Stock"
        value={analytics.lowStockProducts}
        subtitle="Needs Restocking"
      />



      <AnalyticsCard
        title="Customers"
        value={analytics.customerUsers}
        subtitle="Registered Customers"
      />

      <AnalyticsCard
        title="Administrators"
        value={analytics.adminUsers}
        subtitle="System Admins"
      />



      <AnalyticsCard
        title="Categories"
        value={analytics.totalCategories}
        subtitle="Product Categories"
      />

      <AnalyticsCard
        title="Active Categories"
        value={analytics.activeCategories}
        subtitle="Visible Categories"
      />

      <AnalyticsCard
        title="Inactive Categories"
        value={analytics.inactiveCategories}
        subtitle="Hidden Categories"
      />





      <div>

        <h2 className="text-2xl font-semibold">

          Analytics Overview

        </h2>

        <p className="text-gray-500 mt-1">

          Visual insights into your business performance.

        </p>

      </div>

      <div
        className="
    grid
    grid-cols-1
    lg:grid-cols-2
    gap-6
    mt-8
  "
      >

        <RevenueChart
          revenue={analytics.totalRevenue}
        />

        <OrdersChart
          pending={analytics.pendingOrders}
          completed={analytics.completedOrders}
        />

        <ProductsChart
          activeProducts={analytics.activeProducts}
          lowStockProducts={analytics.lowStockProducts}
        />

        <UsersChart
          adminUsers={analytics.adminUsers}
          customerUsers={analytics.customerUsers}
        />

        <CategoriesChart
          activeCategories={analytics.activeCategories}
          inactiveCategories={analytics.inactiveCategories}
        />

      </div>


    </div>

  );

}