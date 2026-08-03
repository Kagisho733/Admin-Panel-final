import {
  FaBoxes,
  FaExclamationTriangle,
  FaTimesCircle,
  FaWarehouse,
} from "react-icons/fa";

import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  inventoryValue: number;
}

export default function InventoryStats({
  totalProducts,
  lowStockCount,
  outOfStockCount,
  inventoryValue,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Tracked Products
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {totalProducts}
            </h2>

          </div>

          <div className="rounded-xl bg-blue-100 p-4">

            <FaBoxes
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
              Low Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {lowStockCount}
            </h2>

          </div>

          <div className="rounded-xl bg-yellow-100 p-4">

            <FaExclamationTriangle
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
              Out Of Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              {outOfStockCount}
            </h2>

          </div>

          <div className="rounded-xl bg-red-100 p-4">

            <FaTimesCircle
              className="text-red-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Stock Value
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(inventoryValue)}
            </h2>

          </div>

          <div className="rounded-xl bg-emerald-100 p-4">

            <FaWarehouse
              className="text-emerald-600"
              size={24}
            />

          </div>

        </div>

      </div>

    </div>
  );
}
