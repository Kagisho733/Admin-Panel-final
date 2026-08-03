import type { Product } from "../../types/Product";

import { getStockStatus } from "../../services/inventoryService";

import { formatCurrency } from "../../utils/formatCurrency";

import StockStatusBadge from "./StockStatusBadge";

interface Props {
  products: Product[];
  onAdjust: (product: Product) => void;
  onHistory: (product: Product) => void;
}

export default function InventoryTable({
  products,
  onAdjust,
  onHistory,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Product
            </th>

            <th className="px-6 py-4 text-left">
              SKU
            </th>

            <th className="px-6 py-4 text-left">
              Stock
            </th>

            <th className="px-6 py-4 text-left">
              Minimum
            </th>

            <th className="px-6 py-4 text-left">
              Stock Value
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

          {products.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="py-12 text-center text-gray-500"
              >

                No products found.

              </td>

            </tr>

          ) : (

            products.map((product) => (

              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4 font-semibold">

                  {product.name}

                  <p className="mt-1 text-sm font-normal text-gray-500">
                    {product.category}
                  </p>

                </td>

                <td className="px-6 py-4 text-gray-600">
                  {product.sku || "-"}
                </td>

                <td className="px-6 py-4 font-semibold">
                  {product.stock ?? 0}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {product.minStock ?? 0}
                </td>

                <td className="px-6 py-4">
                  {formatCurrency(
                    (product.stock ?? 0) *
                    (product.costPrice ?? 0)
                  )}
                </td>

                <td className="px-6 py-4">

                  <StockStatusBadge
                    status={getStockStatus(product)}
                  />

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onAdjust(product)}
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
                      Adjust
                    </button>

                    <button
                      onClick={() => onHistory(product)}
                      className="
                        rounded-lg
                        bg-slate-100
                        px-4
                        py-2
                        transition
                        hover:bg-slate-200
                      "
                    >
                      History
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
