import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "../../types/Order";

import type { Product } from "../../types/Product";

import type { OrderErrors }
from "../../validation/orderValidation";

import { validateOrder }
from "../../validation/orderValidation";

import {
  defaultOrder,
  orderStatusOptions,
  paymentStatusOptions,
} from "../../data/defaultOrder";

import { createOrder } from "../../services/orderService";

import OrderItemsTable from "./OrderItemsTable";

import OrderSummaryCard from "./OrderSummaryCard";

import PaymentStatusBadge from "./PaymentStatusBadge";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSaved: () => void;
}

export default function OrderForm({
  open,
  products,
  onClose,
  onSaved,
}: Props) {

  const { user } = useAuth();

  const [form, setForm] =
    useState<Order>(defaultOrder);

  const [errors, setErrors] =
    useState<OrderErrors>({});

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!open) {

      return;

    }

    setErrors({});

    setForm({
      ...defaultOrder,
      items: [],
    });

  }, [open]);

  function handleAddProduct(productId: string) {

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

    const newItem: OrderItem = {

      productId: product.id,

      name: product.name,

      quantity: 1,

      price: product.price ?? 0,

    };

    setForm((previous) => ({
      ...previous,
      items: [...previous.items, newItem],
    }));

  }

  function handleQuantityChange(
    productId: string,
    quantity: number
  ) {

    setForm((previous) => ({

      ...previous,

      items: previous.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      ),

    }));

  }

  function handlePriceChange(
    productId: string,
    price: number
  ) {

    setForm((previous) => ({

      ...previous,

      items: previous.items.map((item) =>
        item.productId === productId
          ? { ...item, price }
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

  async function handleSave() {

    const validationErrors = validateOrder(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {

      toast.error("Please fix the highlighted fields.");

      return;

    }

    setSaving(true);

    try {

      const subtotal = form.items.reduce(
        (sum, item) =>
          sum + (item.quantity ?? 0) * (item.price ?? 0),
        0
      );

      await createOrder(
        {
          ...form,
          totalAmount: subtotal * 1.15,
        },
        user?.email ?? "Unknown"
      );

      toast.success("Order created.");

      onSaved();

      onClose();

    } catch (error) {

      console.error(
        "Failed to create order:",
        error
      );

      toast.error("Failed to create order.");

    } finally {

      setSaving(false);

    }

  }

  if (!open) return null;

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
              New Order
            </h2>

            <p className="mt-1 text-gray-500">
              Capture an order manually.
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

          {/* Customer Details */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="mb-4 text-lg font-semibold">
              Customer Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      customerName: e.target.value,
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

                {errors.customerName && (

                  <p className="mt-2 text-sm text-red-600">
                    {errors.customerName}
                  </p>

                )}

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Customer Email
                </label>

                <input
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      customerEmail: e.target.value,
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

                {errors.customerEmail && (

                  <p className="mt-2 text-sm text-red-600">
                    {errors.customerEmail}
                  </p>

                )}

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Phone
                </label>

                <input
                  type="text"
                  value={form.customerPhone ?? ""}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      customerPhone: e.target.value,
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

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Order Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      status: e.target.value as OrderStatus,
                    }))
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

                  {orderStatusOptions.map((option) => (

                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>

                  ))}

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Payment Status
                </label>

                <div className="flex items-center gap-4">

                  <select
                    value={form.paymentStatus ?? "unpaid"}
                    onChange={(e) =>
                      setForm((previous) => ({
                        ...previous,
                        paymentStatus:
                          e.target.value as PaymentStatus,
                      }))
                    }
                    className="
                      flex-1
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

                    {paymentStatusOptions.map((option) => (

                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>

                    ))}

                  </select>

                  <PaymentStatusBadge
                    status={form.paymentStatus}
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Notes
                </label>

                <input
                  type="text"
                  value={form.notes ?? ""}
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

              </div>

            </div>

          </div>

          {/* Order Items */}

          <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h3 className="mb-4 text-lg font-semibold">
              Order Items
            </h3>

            <select
              value=""
              onChange={(e) =>
                handleAddProduct(e.target.value)
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

            <OrderItemsTable
              items={form.items}
              editable
              onQuantityChange={handleQuantityChange}
              onPriceChange={handlePriceChange}
              onRemove={handleRemoveItem}
            />

            {errors.items && (

              <p className="mt-3 text-sm text-red-600">
                {errors.items}
              </p>

            )}

          </div>

          <OrderSummaryCard items={form.items} />

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
            {saving ? "Saving..." : "Create Order"}
          </button>

        </div>

      </div>

    </div>
  );
}
