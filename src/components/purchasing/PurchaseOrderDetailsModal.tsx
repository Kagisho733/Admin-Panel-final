import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { PurchaseOrder } from "../../types/PurchaseOrder";

import {
  receivePurchaseOrder,
  updatePurchaseOrderStatus,
} from "../../services/purchaseOrderService";

import { formatCurrency } from "../../utils/formatCurrency";

import PurchaseOrderStatusBadge from "./PurchaseOrderStatusBadge";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  purchaseOrder: PurchaseOrder | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function PurchaseOrderDetailsModal({
  open,
  purchaseOrder,
  onClose,
  onSaved,
}: Props) {

  const { user } = useAuth();

  const [receiving, setReceiving] =
    useState<Record<string, number>>({});

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!open || !purchaseOrder) {

      return;

    }

    const initial: Record<string, number> = {};

    purchaseOrder.items.forEach((item) => {

      initial[item.productId] = Math.max(
        item.quantity - (item.receivedQuantity ?? 0),
        0
      );

    });

    setReceiving(initial);

  }, [open, purchaseOrder]);

  async function handleReceive() {

    if (!purchaseOrder) {

      return;

    }

    const totalReceiving = Object.values(receiving).reduce(
      (sum, quantity) => sum + quantity,
      0
    );

    if (totalReceiving <= 0) {

      toast.error("Enter at least one quantity to receive.");

      return;

    }

    setSaving(true);

    try {

      await receivePurchaseOrder(
        purchaseOrder,
        receiving,
        user?.email ?? "Unknown"
      );

      toast.success("Stock received.");

      onSaved();

      onClose();

    } catch (error) {

      console.error(
        "Failed to receive purchase order:",
        error
      );

      toast.error("Failed to receive stock.");

    } finally {

      setSaving(false);

    }

  }

  async function handleCancel() {

    if (!purchaseOrder?.id) {

      return;

    }

    const confirmed = window.confirm(
      "Cancel this purchase order?"
    );

    if (!confirmed) {

      return;

    }

    try {

      await updatePurchaseOrderStatus(
        purchaseOrder.id,
        "cancelled",
        user?.email ?? "Unknown"
      );

      toast.success("Purchase order cancelled.");

      onSaved();

      onClose();

    } catch (error) {

      console.error(
        "Failed to cancel purchase order:",
        error
      );

      toast.error("Failed to cancel purchase order.");

    }

  }

  if (!open || !purchaseOrder) return null;

  const canReceive =
    purchaseOrder.status === "ordered" ||
    purchaseOrder.status === "partially-received" ||
    purchaseOrder.status === "draft";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              {purchaseOrder.poNumber}
            </h2>

            <p className="mt-1 text-gray-500">
              {purchaseOrder.supplierName}
            </p>

          </div>

          <div className="flex items-center gap-4">

            <PurchaseOrderStatusBadge
              status={purchaseOrder.status}
            />

            <button
              onClick={onClose}
              className="text-2xl text-gray-500 transition hover:text-black"
            >
              ✕
            </button>

          </div>

        </div>

        <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6">

          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Product
                  </th>

                  <th className="px-4 py-3 text-left">
                    Ordered
                  </th>

                  <th className="px-4 py-3 text-left">
                    Received
                  </th>

                  <th className="px-4 py-3 text-left">
                    Unit Cost
                  </th>

                  <th className="px-4 py-3 text-left">
                    Line Total
                  </th>

                  {canReceive && (

                    <th className="px-4 py-3 text-left">
                      Receive Now
                    </th>

                  )}

                </tr>

              </thead>

              <tbody>

                {purchaseOrder.items.map((item) => (

                  <tr
                    key={item.productId}
                    className="border-t"
                  >

                    <td className="px-4 py-3">

                      {item.name}

                      <p className="text-sm text-gray-500">
                        {item.sku || "-"}
                      </p>

                    </td>

                    <td className="px-4 py-3">
                      {item.quantity}
                    </td>

                    <td className="px-4 py-3">
                      {item.receivedQuantity ?? 0}
                    </td>

                    <td className="px-4 py-3">
                      {formatCurrency(item.unitCost)}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(
                        item.quantity * item.unitCost
                      )}
                    </td>

                    {canReceive && (

                      <td className="px-4 py-3">

                        <input
                          type="number"
                          min={0}
                          max={
                            item.quantity -
                            (item.receivedQuantity ?? 0)
                          }
                          value={
                            receiving[item.productId] ?? 0
                          }
                          onChange={(e) =>
                            setReceiving((previous) => ({
                              ...previous,
                              [item.productId]:
                                Number(e.target.value),
                            }))
                          }
                          className="w-24 rounded-lg border px-3 py-2"
                        />

                      </td>

                    )}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  {formatCurrency(purchaseOrder.subtotal ?? 0)}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  VAT
                </span>

                <span className="font-semibold">
                  {formatCurrency(purchaseOrder.vatAmount ?? 0)}
                </span>

              </div>

              <div className="flex items-center justify-between border-t pt-3">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(purchaseOrder.totalAmount ?? 0)}
                </span>

              </div>

            </div>

            {purchaseOrder.notes && (

              <p className="mt-6 text-gray-600">
                {purchaseOrder.notes}
              </p>

            )}

          </div>

        </div>

        <div className="flex flex-wrap justify-end gap-4 border-t p-6">

          {purchaseOrder.status !== "cancelled" &&
            purchaseOrder.status !== "received" && (

            <button
              onClick={handleCancel}
              className="
                rounded-xl
                bg-red-600
                px-5
                py-2.5
                text-white
                transition
                hover:bg-red-700
              "
            >
              Cancel Order
            </button>

          )}

          <button
            onClick={onClose}
            className="
              rounded-xl
              bg-gray-300
              px-5
              py-2.5
              transition
              hover:bg-gray-400
            "
          >
            Close
          </button>

          {canReceive && (

            <button
              onClick={handleReceive}
              disabled={saving}
              className="
                rounded-xl
                bg-green-600
                px-5
                py-2.5
                text-white
                transition
                hover:bg-green-700
                disabled:opacity-50
              "
            >
              {saving ? "Receiving..." : "Receive Stock"}
            </button>

          )}

        </div>

      </div>

    </div>
  );
}
