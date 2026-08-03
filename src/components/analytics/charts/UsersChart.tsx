import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  adminUsers: number;
  customerUsers: number;
}

export default function UsersChart({
  adminUsers,
  customerUsers,
}: Props) {

  const data = [
    {
      name: "Customers",
      value: customerUsers,
    },
    {
      name: "Admins",
      value: adminUsers,
    },
  ];

  const COLORS = [
    "#3b82f6",
    "#ef4444",
  ];

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">

        Users by Role

      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >

              {data.map((entry, index) => (

                <Cell
                  key={entry.name}
                  fill={COLORS[index]}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}