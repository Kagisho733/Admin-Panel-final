import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import type { SalesReportRow } from "../../types/Report";

interface Props {
  data: SalesReportRow[];
}

export default function SalesTrendChart({
  data,
}: Props) {

  return (

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">

        Sales Trend

      </h2>

      {data.length === 0 ? (

        <p className="py-12 text-center text-gray-500">
          No sales in the selected period.
        </p>

      ) : (

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="period" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>

  );

}
