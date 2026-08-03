import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  activeProducts: number;
  lowStockProducts: number;
}

export default function ProductsChart({
  activeProducts,
  lowStockProducts,
}: Props) {

  const data = [
    {
      name: "Active",
      value: activeProducts,
    },
    {
      name: "Low Stock",
      value: lowStockProducts,
    },
  ];

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">

        Product Status

      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}