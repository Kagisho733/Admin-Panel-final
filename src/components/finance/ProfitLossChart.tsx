import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import type { MonthlyFinancePoint } from "../../types/Finance";

interface Props {
  data: MonthlyFinancePoint[];
}

export default function ProfitLossChart({
  data,
}: Props) {

  return (

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">

        Revenue vs Expenses

      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="#16a34a"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#dc2626"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}
