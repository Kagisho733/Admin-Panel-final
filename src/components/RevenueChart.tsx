import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { revenueData } from "../data/revenueData";

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Revenue Overview
          </h2>

          <p className="text-gray-500 mt-1">
            Monthly revenue performance
          </p>
        </div>

        <div className="text-right">

          <p className="text-sm text-gray-500">
            This Month
          </p>

          <h3 className="text-3xl font-bold text-green-600">
            R248,500
          </h3>

        </div>

      </div>

      <ResponsiveContainer width="100%" height={300}>

        <AreaChart data={revenueData}>

          <defs>

            <linearGradient
              id="revenueGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >

              <stop
                offset="5%"
                stopColor="#2563eb"
                stopOpacity={0.8}
              />

              <stop
                offset="95%"
                stopColor="#2563eb"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            fill="url(#revenueGradient)"
            strokeWidth={3}
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}