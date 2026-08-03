import {
  FaFileInvoiceDollar,
  FaClock,
  FaCheckCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  totalOrders: number;
  pendingOrders: number;
  receivedOrders: number;
  totalValue: number;
}

export default function PurchaseStats({
  totalOrders,
  pendingOrders,
  receivedOrders,
  totalValue,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Purchase Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {totalOrders}
            </h2>

          </div>

          <div className="rounded-xl bg-blue-100 p-4">

            <FaFileInvoiceDollar
              className="text-blue-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Awaiting Delivery
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingOrders}
            </h2>

          </div>

          <div className="rounded-xl bg-yellow-100 p-4">

            <FaClock
              className="text-yellow-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Received
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {receivedOrders}
            </h2>

          </div>

          <div className="rounded-xl bg-green-100 p-4">

            <FaCheckCircle
              className="text-green-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Purchase Value
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(totalValue)}
            </h2>

          </div>

          <div className="rounded-xl bg-emerald-100 p-4">

            <FaMoneyBillWave
              className="text-emerald-600"
              size={24}
            />

          </div>

        </div>

      </div>

    </div>
  );
}
