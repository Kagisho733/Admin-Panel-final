import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { FaTrash } from "react-icons/fa";

import type { PurchaseOrder, PurchaseOrderItem }
from "../../types/PurchaseOrder";

import type { Supplier } from "../../types/Supplier";

import type { Product } from "../../types/Product";

import {
  defaultPurchaseOrder,
} from "../../data/defaultPurchaseOrder";

import {
  createPurchaseOrder,
  calculatePurchaseOrderTotals,
  generatePurchaseOrderNumber,
} from "../../services/purchaseOrderService";

import { formatCurrency } from "../../utils/formatCurrency";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  suppliers: Supplier[];
  products: Product[];
  onClose: () => void;
  onSaved: () => void;
}

export default function PurchaseOrderFormModal({
  open,
  suppliers,
  products,
  onClose,
  onSaved,
}: Props) {

  const { user } = useAuth();

  const [form, setForm] =
    useState<PurchaseOrder>(defaultPurchaseOrder);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!open) {

      return;

    }

    setForm({

      ...defaultPurchaseOrder,

      poNumber: generatePurchaseOrderNumber(),

      items: [],

    });

  }, [open]);

  function handleSupplierChange(supplierId: string) {

    const supplier = suppliers.find(
      (item) => item.id === supplierId
    );

    setForm((previous) => ({
      ...previous,
      supplierId,
      supplierName: supplier?.name ?? "",
    }));

  }

  function handleAddItem(productId: string) {

    if (!productId) {

      return;

    }

    const product = products.find(
      (item) => item.id === productId
    );

    if (!product?.id) {

      return;

    }

    if (
      form.items.some(
        (item) => item.productId === product.id
      )
    ) {

      toast.error("Product is already on this order.");

      return;

    }

    const newItem: PurchaseOrderItem = {

      productId: product.id,

      name: product.name,

      sku: product.sku ?? "",

      quantity: 1,

      receivedQuantity: 0,

      unitCost: product.costPrice ?? 0,

    };

    setForm((previous) => ({
      ...previous,
      items: [...previous.items, newItem],
    }));

  }

  function handleItemChange(
    productId: string,
    field: "quantity" | "unitCost",
    value: number
  ) {

    setForm((previous) => ({

      ...previous,

      items: previous.items.map((item) =>
        item.productId === productId
          ? { ...item, [field]: value }
          : item
      ),

    }));

  }

  function handleRemoveItem(productId: string) {

    setForm((previous) => ({

      ...previous,

      items: previous.items.filter(
        (item) => item.productId !== productId
      ),

    }));

  }

  async function handleSave(
    status: "draft" | "ordered"
  ) {

    if (!form.supplierId) {

      toast.error("Please select a supplier.");

      return;

    }

    if (form.items.length === 0) {

      toast.error("Add at least one product.");

      return;

    }

    if (
      form.items.some(
        (item) => item.quantity <= 0
      )
    ) {

      toast.error("Quantities must be greater than zero.");

      return;

    }

    setSaving(true);

    try {

      await createPurchaseOrder({

        ...form,

        status,

        createdBy: user?.email ?? "Unknown",

      });

      toast.success(
        status === "draft"
          ? "Draft saved."
          : "Purchase order created."
      );

      onSaved();

      onClose();

    } catch (error) {

      console.error(
        "Failed to save purchase order:",
        error
      );

      toast.error("Failed to save purchase order.");

    } finally {

      setSaving(false);

    }

  }

  if (!open) return null;

  const totals =
    calculatePurchaseOrderTotals(form.items);

  const availableProducts = products.filter(
    (product) =>
      !form.items.some(
        (item) => item.productId === product.id
      )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              New Purchase Order
            </h2>

            <p className="mt-1 text-gray-500">
              {form.poNumber}
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

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Supplier
                </label>

                <select
                  value={form.supplierId}
                  onChange={(e) =>
                    handleSupplierChange(e.target.value)
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-200
                  "
                >

                  <option value="">
                    Select a supplier...
                  </option>

                  {suppliers.map((supplier) => (

                    <option
                      key={supplier.id}
                      value={supplier.id}
                    >
                      {supplier.name}
                    </option>

                  ))}

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Expected Delivery Date
                </label>

                <input
                  type="date"
                  value={form.expectedDate}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      expectedDate: e.target.value,
                    }))
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-200
                  "
                />

              </div>

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="mb-4 text-lg font-semibold">
              Order Items
            </h3>

            <select
              value=""
              onChange={(e) =>
                handleAddItem(e.target.value)
              }
              className="
                mb-4
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            >

              <option value="">
                Add a product...
              </option>

              {availableProducts.map((product) => (

                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name}
                  {product.sku ? ` (${product.sku})` : ""}
                </option>

              ))}

            </select>

            {form.items.length === 0 ? (

              <p className="text-sm text-gray-500">
                No products added yet.
              </p>

            ) : (

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
                        Unit Cost
                      </th>

                      <th className="px-4 py-3 text-left">
                        Line Total
                      </th>

                      <th className="px-4 py-3" />

                    </tr>

                  </thead>

                  <tbody>

                    {form.items.map((item) => (

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

                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              handleItemChange(
                                item.productId,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 rounded-lg border px-3 py-2"
                          />

                        </td>

                        <td className="px-4 py-3">

                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.unitCost}
                            onChange={(e) =>
                              handleItemChange(
                                item.productId,
                                "unitCost",
                                Number(e.target.value)
                              )
                            }
                            className="w-32 rounded-lg border px-3 py-2"
                          />

                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {formatCurrency(
                            item.quantity * item.unitCost
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">

                          <button
                            onClick={() =>
                              handleRemoveItem(item.productId)
                            }
                            className="text-gray-400 transition hover:text-red-600"
                          >
                            <FaTrash />
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <label className="mb-2 block text-sm font-medium">
              Notes
            </label>

            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((previous) => ({
                  ...previous,
                  notes: e.target.value,
                }))
              }
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            />

            <div className="mt-6 space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold">
                  {formatCurrency(totals.subtotal)}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-500">
                  VAT (15%)
                </span>

                <span className="font-semibold">
                  {formatCurrency(totals.vatAmount)}
                </span>

              </div>

              <div className="flex items-center justify-between border-t pt-3">

                <span className="font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(totals.totalAmount)}
                </span>

              </div>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap justify-end gap-4 border-t p-6">

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
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="
              rounded-xl
              bg-slate-100
              px-5
              py-2.5
              transition
              hover:bg-slate-200
              disabled:opacity-50
            "
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSave("ordered")}
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
            {saving ? "Saving..." : "Place Order"}
          </button>

        </div>

      </div>

    </div>
  );
}
