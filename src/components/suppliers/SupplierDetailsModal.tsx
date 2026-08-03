import type { Supplier } from "../../types/Supplier";

import { formatCurrency } from "../../utils/formatCurrency";

import SupplierStatusBadge from "./SupplierStatusBadge";

interface Props {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
}

export default function SupplierDetailsModal({
  open,
  supplier,
  onClose,
}: Props) {

  if (!open || !supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              {supplier.name}
            </h2>

            <p className="mt-1 text-gray-500">
              {supplier.email}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-black"
          >
            ✕
          </button>

        </div>

        <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-2xl border bg-white p-6 shadow-sm">

              <h3 className="mb-3 font-semibold">
                Contact Information
              </h3>

              <p className="text-gray-600">
                Contact: {supplier.contactPerson || "-"}
              </p>

              <p className="mt-1 text-gray-600">
                Email: {supplier.email || "-"}
              </p>

              <p className="mt-1 text-gray-600">
                Phone: {supplier.phone || "-"}
              </p>

            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">

              <h3 className="mb-3 font-semibold">
                Address
              </h3>

              <p className="text-gray-600">
                {supplier.address || "-"}
              </p>

              <p className="mt-1 text-gray-600">

                {supplier.city || "-"}

                {" "}

                {supplier.province || ""}

              </p>

              <p className="mt-1 text-gray-600">
                {supplier.postalCode || "-"}
              </p>

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="mb-4 text-lg font-semibold">
              Account Summary
            </h3>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

              <div>

                <p className="text-sm text-gray-500">
                  Purchase Orders
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {supplier.totalOrders ?? 0}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Total Purchased
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatCurrency(supplier.totalSpent ?? 0)}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Payment Terms
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {supplier.paymentTerms || "-"}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Status
                </p>

                <div className="mt-2">

                  <SupplierStatusBadge
                    status={supplier.status}
                  />

                </div>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="mb-3 font-semibold">
              Notes
            </h3>

            <p className="text-gray-600">
              {supplier.notes || "No notes for this supplier."}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
