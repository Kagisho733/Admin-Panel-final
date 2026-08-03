import type { PurchaseOrder } from "../../types/PurchaseOrder";

import { formatCurrency } from "../../utils/formatCurrency";

import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";

interface Props {
  purchaseOrders: PurchaseOrder[];
  onView: (purchaseOrder: PurchaseOrder) => void;
  onDelete: (purchaseOrder: PurchaseOrder) => void;
}

export default function PurchaseOrdersTable({
  purchaseOrders,
  onView,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              PO Number
            </th>

            <th className="px-6 py-4 text-left">
              Supplier
            </th>

            <th className="px-6 py-4 text-left">
              Items
            </th>

            <th className="px-6 py-4 text-left">
              Total
            </th>

            <th className="px-6 py-4 text-left">
              Expected
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {purchaseOrders.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="py-12 text-center text-gray-500"
              >

                No purchase orders found.

              </td>

            </tr>

          ) : (

            purchaseOrders.map((purchaseOrder) => (

              <tr
                key={purchaseOrder.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4 font-semibold">
                  {purchaseOrder.poNumber}
                </td>

                <td className="px-6 py-4">
                  {purchaseOrder.supplierName}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {purchaseOrder.items.length}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {formatCurrency(purchaseOrder.totalAmount ?? 0)}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {purchaseOrder.expectedDate || "-"}
                </td>

                <td className="px-6 py-4">

                  <PurchaseOrderStatusBadge
                    status={purchaseOrder.status}
                  />

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onView(purchaseOrder)}
                      className="
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      Open
                    </button>

                    <button
                      onClick={() => onDelete(purchaseOrder)}
                      className="
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
                        text-white
                        transition
                        hover:bg-red-700
                      "
                    >
                      Delete
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
