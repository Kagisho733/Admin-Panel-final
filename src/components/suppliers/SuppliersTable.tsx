import type { Supplier } from "../../types/Supplier";

import { formatCurrency } from "../../utils/formatCurrency";

import SupplierStatusBadge from "./SupplierStatusBadge";

interface Props {
  suppliers: Supplier[];
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export default function SuppliersTable({
  suppliers,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Supplier
            </th>

            <th className="px-6 py-4 text-left">
              Contact
            </th>

            <th className="px-6 py-4 text-left">
              Phone
            </th>

            <th className="px-6 py-4 text-left">
              Terms
            </th>

            <th className="px-6 py-4 text-left">
              Total Purchased
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

          {suppliers.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="py-12 text-center text-gray-500"
              >

                No suppliers found.

              </td>

            </tr>

          ) : (

            suppliers.map((supplier) => (

              <tr
                key={supplier.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4 font-semibold">

                  {supplier.name}

                  <p className="mt-1 text-sm font-normal text-gray-500">
                    {supplier.city || "-"}
                  </p>

                </td>

                <td className="px-6 py-4">

                  {supplier.contactPerson}

                  <p className="mt-1 text-sm text-gray-500">
                    {supplier.email}
                  </p>

                </td>

                <td className="px-6 py-4 text-gray-600">
                  {supplier.phone}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {supplier.paymentTerms}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {formatCurrency(supplier.totalSpent ?? 0)}
                </td>

                <td className="px-6 py-4">

                  <SupplierStatusBadge
                    status={supplier.status}
                  />

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onView(supplier)}
                      className="
                        rounded-lg
                        bg-slate-100
                        px-3
                        py-2
                        transition
                        hover:bg-slate-200
                      "
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit(supplier)}
                      className="
                        rounded-lg
                        bg-blue-600
                        px-3
                        py-2
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(supplier)}
                      className="
                        rounded-lg
                        bg-red-600
                        px-3
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
