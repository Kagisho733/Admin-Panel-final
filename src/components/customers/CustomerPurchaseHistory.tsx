import { useEffect, useState } from "react";

import type { Order } from "../../types/Order";

import { getOrders } from "../../services/orderService";

import { formatCurrency } from "../../utils/formatCurrency";

import OrderStatusBadge from "../orders/OrderStatusBadge";

interface Props {
  customerEmail: string;
}

export default function CustomerPurchaseHistory({
  customerEmail,
}: Props) {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadOrders() {

    setLoading(true);

    try {

      const data = await getOrders();

      setOrders(
        data.filter(
          (order) =>
            (order.customerEmail ?? "")
              .toLowerCase() ===
            customerEmail.toLowerCase()
        )
      );

    } catch (error) {

      console.error(
        "Failed to load purchase history:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  function formatDate(value: any) {

    if (!value) {

      return "-";

    }

    const date =
      typeof value.toDate === "function"
        ? value.toDate()
        : new Date(value);

    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleDateString();

  }

  useEffect(() => {

    loadOrders();

  }, [customerEmail]);

  const totalSpent = orders
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (sum, order) => sum + (order.totalAmount ?? 0),
      0
    );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">

        <h3 className="text-lg font-semibold">
          Purchase History
        </h3>

        {orders.length > 0 && (

          <p className="text-sm text-gray-500">

            {orders.length} order{orders.length !== 1 ? "s" : ""}

            {" • "}

            <span className="font-semibold text-green-600">
              {formatCurrency(totalSpent)}
            </span>

          </p>

        )}

      </div>

      {loading ? (

        <p className="text-sm text-gray-500">
          Loading purchase history...
        </p>

      ) : orders.length === 0 ? (

        <p className="text-sm text-gray-500">
          This customer has not placed any orders yet.
        </p>

      ) : (

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-4 py-3 text-left">
                  Date
                </th>

                <th className="px-4 py-3 text-left">
                  Items
                </th>

                <th className="px-4 py-3 text-left">
                  Total
                </th>

                <th className="px-4 py-3 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-3 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {(order.items ?? []).length}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(order.totalAmount ?? 0)}
                  </td>

                  <td className="px-4 py-3">

                    <OrderStatusBadge status={order.status} />

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}
