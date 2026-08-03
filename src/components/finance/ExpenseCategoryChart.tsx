import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data: { category: string; amount: number }[];
}

const colors = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ea580c",
  "#4f46e5",
  "#64748b",
];

export default function ExpenseCategoryChart({
  data,
}: Props) {

  return (

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">

        Expenses By Category

      </h2>

      {data.length === 0 ? (

        <p className="py-12 text-center text-gray-500">
          No expenses captured yet.
        </p>

      ) : (

        <div className="h-80">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                outerRadius={110}
                label
              >

                {data.map((entry, index) => (

                  <Cell
                    key={entry.category}
                    fill={colors[index % colors.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </div>

      )}

    </div>

  );

}
