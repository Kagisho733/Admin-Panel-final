
interface Props {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
}

export default function OrderStats({
  totalOrders,
  pendingOrders,
  completedOrders,
  revenue,
}: Props) {
  const cards = [
    {
      title: "Total Orders",
      value: totalOrders,
      color: "bg-blue-600",
    },
    {
      title: "Pending",
      value: pendingOrders,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: completedOrders,
      color: "bg-green-600",
    },
    {
      title: "Revenue",
      value: `R ${revenue.toLocaleString()}`,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-white p-6 shadow-sm border"
        >
          <div
            className={`mb-4 h-3 w-20 rounded-full ${card.color}`}
          />

          <p className="text-sm text-slate-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}