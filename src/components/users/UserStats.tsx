import type { User } from "../../types/User";

interface Props {
  users: User[];
}

export default function UserStats({
  users,
}: Props) {

  const totalUsers =
    users.length;

  const totalCustomers =
    users.filter(
      (user) =>
        user.role === "customer"
    ).length;

  const totalAdmins =
    users.filter(
      (user) =>
        user.role === "admin"
    ).length;

  const totalRevenue =
    users.reduce(
      (sum, user) =>
        sum + user.totalSpent,
      0
    );

  const cards = [

    {
      title: "Total Users",
      value: totalUsers,
      color: "bg-blue-500",
    },

    {
      title: "Customers",
      value: totalCustomers,
      color: "bg-green-500",
    },

    {
      title: "Admins",
      value: totalAdmins,
      color: "bg-purple-500",
    },

    {
      title: "Revenue",
      value: `R${totalRevenue.toFixed(2)}`,
      color: "bg-orange-500",
    },

  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      "
    >

      {cards.map((card) => (

        <div
          key={card.title}
          className="
            rounded-2xl
            border
            bg-white
            p-6
            shadow-sm
          "
        >

          <div
            className={`
              h-3
              rounded-full
              mb-5
              ${card.color}
            `}
          />

          <p className="text-gray-500">

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