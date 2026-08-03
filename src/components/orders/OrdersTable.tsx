import type { Order } from "../../types/Order";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  orders: Order[];
  onView: (order: Order) => void;


  hasFilters: boolean;

  selectedOrders: string[];

  toggleOrder: (orderId: string) => void;

  toggleAllOrders: () => void;

  sortField:
  | "id"
  | "customer"
  | "status"
  | "total"
  | "date";

  sortDirection: "asc" | "desc";

  setSortField: React.Dispatch<
    React.SetStateAction<
      "id"
      | "customer"
      | "status"
      | "total"
      | "date"
    >
  >;

  setSortDirection: React.Dispatch<
    React.SetStateAction<"asc" | "desc">
  >;
}

export default function OrdersTable({
  orders,
  onView,
  hasFilters,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  selectedOrders,
  toggleOrder,
  toggleAllOrders,
}: Props) {


  function formatOrderDate(createdAt: any) {

    if (!createdAt) {

      return "-";

    }

    if (typeof createdAt.toDate === "function") {

      return createdAt
        .toDate()
        .toLocaleDateString();

    }

    return new Date(createdAt)
      .toLocaleDateString();

  }

  function handleSort(
    field: "id" | "customer" | "status" | "total" | "date"
  ) {

    if (sortField === field) {

      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);

      setSortDirection("asc");

    }

  }


  return (

    <div className="overflow-x-auto rounded-xl border bg-white">

     <table className="min-w-full table-auto">

        <thead className="bg-gray-100">

          <tr>

            <th className="w-14 px-4 py-4 text-center">

              <input
                type="checkbox"
                checked={
                  orders.length > 0 &&
                  selectedOrders.length === orders.length
                }
                onChange={toggleAllOrders}
                className="h-4 w-4 cursor-pointer"
              />

            </th>

            <th
              onClick={() => handleSort("id")}
              className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
            >
              <div className="flex items-center gap-2">

                Order ID

                {sortField === "id" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th
              onClick={() => handleSort("customer")}
              className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
            >
              <div className="flex items-center gap-2">

                Customer

                {sortField === "customer" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th
              onClick={() => handleSort("status")}
              className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
            >
              <div className="flex items-center gap-2">

                Status

                {sortField === "status" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th
              onClick={() => handleSort("total")}
              className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
            >
              <div className="flex items-center gap-2">

                Total

                {sortField === "total" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th
              onClick={() => handleSort("date")}
              className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
            >
              <div className="flex items-center gap-2">

                Date

                {sortField === "date" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th className="px-6 py-4 text-center">

              Actions

            </th>

          </tr>

        </thead>

        <tbody>

          {orders.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="py-10 text-center text-gray-500"
              >

                <div className="flex flex-col items-center py-12">

                  <div className="mb-4 text-6xl">

                    📦

                  </div>

                  <h3 className="text-xl font-semibold">

                    {hasFilters
                      ? "No Matching Orders"
                      : "No Orders Found"}

                  </h3>

                  <p className="mt-2 text-gray-500">

                    {hasFilters
                      ? "Try changing your search or filter."
                      : "Orders will appear here once customers start placing them."}

                  </p>

                </div>

              </td>

            </tr>

          ) : (

            orders.map((order) => (

              <tr
                key={order.id}
                className="border-t"
              >

                <td className="px-4 py-4 text-center">

                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id!)}
                    onChange={() => toggleOrder(order.id!)}
                    className="h-4 w-4 cursor-pointer"
                  />

                </td>

                <td className="px-6 py-4">

                  {order.id?.slice(0, 8)}...

                </td>

                <td className="px-6 py-4">

                  {order.customerName}

                </td>

                <td className="px-6 py-4">

                  <OrderStatusBadge
                    status={order.status}
                  />

                </td>

                <td className="px-6 py-4">

                  R{order.totalAmount.toFixed(2)}

                </td>

                <td className="px-6 py-4">

                  {formatOrderDate(order.createdAt)}

                </td>

               <td className="px-6 py-4">

 <div className="flex justify-center">

  <button
    onClick={() => onView(order)}
    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
  >
    👁 View
  </button>

</div>
</td>
              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

}