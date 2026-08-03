import type { OrderItem } from "../../types/Order";

import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  items: OrderItem[];
  vatRate?: number;
}

export default function OrderSummaryCard({
  items,
  vatRate = 0.15,
}: Props) {

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.quantity ?? 0) * (item.price ?? 0),
    0
  );

  const vatAmount = subtotal * vatRate;

  const total = subtotal + vatAmount;

  return (
    <div className="rounded-xl border bg-white p-5">

      <h4 className="mb-4 font-semibold">
        Order Summary
      </h4>

      <div className="space-y-2">

        <div className="flex items-center justify-between">

          <span className="text-gray-500">
            Items
          </span>

          <span className="font-semibold">
            {items.reduce(
              (sum, item) => sum + (item.quantity ?? 0),
              0
            )}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-gray-500">
            Subtotal
          </span>

          <span className="font-semibold">
            {formatCurrency(subtotal)}
          </span>

        </div>

        <div className="flex items-center justify-between">

          <span className="text-gray-500">
            VAT ({(vatRate * 100).toFixed(0)}%)
          </span>

          <span className="font-semibold">
            {formatCurrency(vatAmount)}
          </span>

        </div>

        <div className="flex items-center justify-between border-t pt-3">

          <span className="font-semibold">
            Total
          </span>

          <span className="text-xl font-bold text-green-600">
            {formatCurrency(total)}
          </span>

        </div>

      </div>

    </div>
  );
}
