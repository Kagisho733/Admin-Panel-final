import StatCard from "../components/StatCard";
import QuickAction from "../components/QuickAction";
import RecentOrders from "../components/RecentOrders";
import RecentActivity from "../components/RecentActivity";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SalesChart from "../components/SalesChart";
import RevenueChart from "../components/RevenueChart";
import DashboardFooter from "../components/dashboard/DashboardFooter";

import { dashboardStats } from "../data/dashboardData";
import {
  quickActions,
  recentOrders,
  recentActivity,
} from "../data/mockDashboard";

export default function Dashboard() {
  return (
    <div className="space-y-10">


      {/* Dashboard Hero Banner */}
      <DashboardHeader />

      {/* Space below the banner */}
  

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        {dashboardStats.map((stat) => (

          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            color={stat.color}
            icon={stat.icon}
          />

        ))}

      </div>

      {/* Sales Chart */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 my-10">

        <SalesChart />

        <RevenueChart />

      </div>

      {/* Quick Actions */}
      <div className="mb-10">

        <h2 className="text-2xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">

          {quickActions.map((action) => (
            <QuickAction
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              route={action.route}
            />

          ))}

        </div>

      </div>

      {/* Dashboard Bottom */}
      <div className="grid lg:grid-cols-2 gap-6">

        <RecentOrders orders={recentOrders} />

        <RecentActivity activity={recentActivity} />

      </div>
      <DashboardFooter />
    </div>
  );


}

