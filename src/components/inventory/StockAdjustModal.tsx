import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { Product } from "../../types/Product";

import type { StockMovementType } from "../../types/Inventory";

import { adjustStock } from "../../services/inventoryService";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function StockAdjustModal({
  open,
  product,
  onClose,
  onSaved,
}: Props) {

  const { user } = useAuth();

  const [type, setType] =
    useState<StockMovementType>("in");

  const [quantity, setQuantity] =
    useState(0);

  const [reason, setReason] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!open) {

      return;

    }

    setType("in");

    setQuantity(0);

    setReason("");

  }, [open, product]);

  async function handleSave() {

    if (!product) {

      return;

    }

    if (quantity < 0) {

      toast.error("Quantity cannot be negative.");

      return;

    }

    if (type !== "adjustment" && quantity === 0) {

      toast.error("Quantity must be greater than zero.");

      return;

    }

    if (!reason.trim()) {

      toast.error("Reason is required.");

      return;

    }

    setSaving(true);

    try {

      await adjustStock(
        product,
        type,
        quantity,
        reason.trim(),
        user?.email ?? "Unknown"
      );

      toast.success("Stock updated.");

      onSaved();

      onClose();

    } catch (error) {

      console.error(
        "Failed to adjust stock:",
        error
      );

      toast.error("Failed to update stock.");

    } finally {

      setSaving(false);

    }

  }

  if (!open || !product) return null;

  const previousStock = product.stock ?? 0;

  const projectedStock =
    type === "in"
      ? previousStock + quantity
      : type === "out"
        ? Math.max(previousStock - quantity, 0)
        : quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              Adjust Stock
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

        <div className="space-y-4 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Movement Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as StockMovementType
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                shadow-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            >

              <option value="in">Stock In</option>

              <option value="out">Stock Out</option>

              <option value="adjustment">Set Exact Stock</option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              {type === "adjustment"
                ? "New Stock Level"
                : "Quantity"}
            </label>

            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                shadow-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Reason
            </label>

            <input
              type="text"
              placeholder="Stock take, damaged goods, supplier delivery..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                shadow-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            />

          </div>

          <div className="rounded-xl bg-gray-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-gray-500">
                Current Stock
              </span>

              <span className="font-semibold">
                {previousStock}
              </span>

            </div>

            <div className="mt-2 flex items-center justify-between">

              <span className="text-gray-500">
                After Adjustment
              </span>

              <span className="text-lg font-bold text-blue-600">
                {projectedStock}
              </span>

            </div>

          </div>

        </div>

        <div className="flex justify-end gap-4 border-t p-6">

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
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              rounded-xl
              bg-blue-600
              px-5
              py-2.5
              text-white
              transition
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save Adjustment"}
          </button>

        </div>

      </div>

    </div>
  );
}
