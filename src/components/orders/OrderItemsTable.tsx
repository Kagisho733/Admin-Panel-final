import { FaTrash } from "react-icons/fa";

import type { OrderItem } from "../../types/Order";

import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  items: OrderItem[];
  editable?: boolean;
  onQuantityChange?: (
    productId: string,
    quantity: number
  ) => void;
  onPriceChange?: (
    productId: string,
    price: number
  ) => void;
  onRemove?: (productId: string) => void;
}

export default function OrderItemsTable({
  items,
  editable = false,
  onQuantityChange,
  onPriceChange,
  onRemove,
}: Props) {

  if (items.length === 0) {

    return (

      <p className="py-6 text-center text-sm text-gray-500">
        No products added to this order yet.
      </p>

    );

  }

  return (
    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-4 py-3 text-left">
              Product
            </th>

            <th className="px-4 py-3 text-left">
              Quantity
            </th>

            <th className="px-4 py-3 text-left">
              Unit Price
            </th>

            <th className="px-4 py-3 text-left">
              Line Total
            </th>

            {editable && (

              <th className="px-4 py-3" />

            )}

          </tr>

        </thead>

        <tbody>

          {items.map((item) => (

            <tr
              key={item.productId}
              className="border-t"
            >

              <td className="px-4 py-3 font-medium">
                {item.name}
              </td>

              <td className="px-4 py-3">

                {editable ? (

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      onQuantityChange?.(
                        item.productId,
                        Number(e.target.value)
                      )
                    }
                    className="w-24 rounded-lg border px-3 py-2"
                  />

                ) : (

                  item.quantity

                )}

              </td>

              <td className="px-4 py-3">

                {editable ? (

                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      onPriceChange?.(
                        item.productId,
                        Number(e.target.value)
                      )
                    }
                    className="w-32 rounded-lg border px-3 py-2"
                  />

                ) : (

                  formatCurrency(item.price ?? 0)

                )}

              </td>

              <td className="px-4 py-3 font-semibold">
                {formatCurrency(
                  (item.quantity ?? 0) * (item.price ?? 0)
                )}
              </td>

              {editable && (

                <td className="px-4 py-3 text-right">

                  <button
                    onClick={() =>
                      onRemove?.(item.productId)
                    }
                    className="text-gray-400 transition hover:text-red-600"
                  >
                    <FaTrash />
                  </button>

                </td>

              )}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
