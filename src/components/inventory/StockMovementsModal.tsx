import { useEffect, useState } from "react";

import type { Product } from "../../types/Product";

import type { StockMovement } from "../../types/Inventory";

import {
  getProductStockMovements,
} from "../../services/inventoryService";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

const typeStyles: Record<StockMovement["type"], string> = {
  in: "bg-green-100 text-green-800",
  out: "bg-red-100 text-red-800",
  adjustment: "bg-blue-100 text-blue-800",
};

const typeLabels: Record<StockMovement["type"], string> = {
  in: "Stock In",
  out: "Stock Out",
  adjustment: "Adjustment",
};

export default function StockMovementsModal({
  open,
  product,
  onClose,
}: Props) {

  const [movements, setMovements] =
    useState<StockMovement[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadMovements(productId: string) {

    setLoading(true);

    try {

      const data =
        await getProductStockMovements(productId);

      setMovements(data);

    } catch (error) {

      console.error(
        "Failed to load stock movements:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (!open || !product?.id) {

      return;

    }

    loadMovements(product.id);

  }, [open, product]);

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              Stock History
            </h2>

            <p className="mt-1 text-gray-500">
              {product.name}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-black"
          >
            ✕
          </button>

        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">

          {loading ? (

            <p className="text-sm text-gray-500">
              Loading stock history...
            </p>

          ) : movements.length === 0 ? (

            <p className="text-sm text-gray-500">
              No stock movements recorded yet.
            </p>

          ) : (

            <div className="space-y-3">

              {movements.map((movement) => (

                <div
                  key={movement.id}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${typeStyles[movement.type]}
                      `}
                    >
                      {typeLabels[movement.type]}
                    </span>

                    <span className="font-semibold">
                      {movement.previousStock}
                      {" → "}
                      {movement.newStock}
                    </span>

                  </div>

                  <p className="mt-3 text-gray-600">
                    {movement.reason}
                  </p>

                  {movement.reference && (

                    <p className="mt-1 text-sm text-gray-500">
                      Reference: {movement.reference}
                    </p>

                  )}

                  <p className="mt-3 text-xs text-gray-400">

                    {movement.createdBy}

                    {" • "}

                    {movement.createdAt?.toDate
                      ? movement.createdAt
                          .toDate()
                          .toLocaleString()
                      : new Date(
                          movement.createdAt
                        ).toLocaleString()}

                  </p>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
