import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { updateOrderStatus } from "../../services/orderService";
import OrderStatusBadge from "./OrderStatusBadge";

import { useAuth } from "../../hooks/useAuth";

import OrderTimeline from "./OrderTimeline";

import PaymentStatusBadge from "./PaymentStatusBadge";

import type {
  Order,
  OrderStatus,
} from "../../types/Order";

interface Props {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onStatusUpdated: () => Promise<void>;
  onGenerateInvoice: (order: Order) => void;
}

export default function OrderDetailsModal({
  open,
  order,
  onClose,
  onStatusUpdated,
  onGenerateInvoice,
}: Props) {

  const { user } = useAuth();


  const [status, setStatus] = useState<OrderStatus>(
  order?.status ?? "pending"
);

  const [savingStatus, setSavingStatus] =
    useState(false);

 useEffect(() => {
  if (order) {
    setStatus(order.status);
  }
}, [order]);

  if (!open || !order) return null;

  const currentOrder = order;

  async function handleStatusChange(
    newStatus: OrderStatus
  ) {

    if (!currentOrder.id) return;

    try {

      setSavingStatus(true);

      await updateOrderStatus(
       currentOrder.id,
        newStatus,
        user?.email ?? "Unknown"
      );

      setStatus(newStatus);

      await onStatusUpdated();

      toast.success(
        "Order status updated."
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to update order status."
      );

    } finally {

      setSavingStatus(false);

    }

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">
            Order Details
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Order ID */}
            <div className="rounded-xl border p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Order ID
              </h3>

              <p className="mt-2 text-lg font-medium break-all">
                {order.id}
              </p>
            </div>

            {/* Customer */}
            <div className="rounded-xl border p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Customer
              </h3>

              <p className="mt-2 text-lg font-medium">
                {order.customerName}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {order.customerEmail}
              </p>
            </div>

            {/* Status */}
            <div className="rounded-xl border p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Status
              </h3>

              <div className="mb-3">
                <OrderStatusBadge status={status} />
              </div>

              <div className="mt-2">
                <select
                  value={status}
                  disabled={savingStatus}
                  onChange={(e) =>
                    handleStatusChange(
                      e.target.value as OrderStatus
                    )
                  }
                  className="
    mt-2
    w-full
    rounded-xl
    border
    p-3
  "
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="processing">
                    Processing
                  </option>

                  <option value="shipped">
                    Shipped
                  </option>

                  <option value="delivered">
                    Delivered
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-xl border p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Total
              </h3>

              <p className="mt-2 text-3xl font-bold text-green-600">
                R{order.totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Payment Status */}
            <div className="rounded-xl border p-5">

              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Payment
              </h3>

              <div className="mt-3">

                <PaymentStatusBadge
                  status={order.paymentStatus}
                />

              </div>

            </div>

            {/* Order Progress */}
            <div className="md:col-span-2">

              <OrderTimeline order={order} />

            </div>

            {/* Ordered Items */}
            <div className="rounded-xl border p-5 md:col-span-2">

              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Ordered Items
              </h3>

              <div className="mt-4 space-y-4">

                {order.items.length === 0 ? (

                  <p className="text-gray-500">
                    No products in this order.
                  </p>

                ) : (

                  order.items.map((item) => (

                    <div
                      key={item.productId}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        p-4
                      "
                    >
                      <div>

                        <p className="font-semibold">
                          {item.name}
                        </p>

                        <p
                          className="
                            mt-2
                            inline-flex
                            rounded-full
                            bg-gray-100
                            px-3
                            py-1
                            text-sm
                          "
                        >
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-semibold">
                          R{item.price.toFixed(2)}
                        </p>

                        <p className="text-sm text-gray-500">
                          Total: R{(
                            item.price * item.quantity
                          ).toFixed(2)}
                        </p>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="mt-8 flex justify-end">

            <button
              onClick={onClose}
              className="
                rounded-xl
                bg-gray-800
                px-6
                py-3
                text-white
                transition
                hover:bg-black
              "
            >
              Close
            </button>

            <button
  onClick={() => onGenerateInvoice(order)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition"
            >
              📄 Generate Invoice
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}