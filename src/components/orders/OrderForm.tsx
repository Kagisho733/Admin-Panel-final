import { useEffect, useState } from "react";
import { FaCheck, FaShoppingCart, FaTimes } from "react-icons/fa";

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

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, saving]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>

      <div role="dialog" aria-modal="true" aria-labelledby="new-order-title" className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-950 to-blue-950 p-6 text-white">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Manual order capture</p><h2 id="new-order-title" className="mt-1 flex items-center gap-3 text-2xl font-black"><FaShoppingCart className="text-cyan-300" />
              New Order
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Capture an order manually.
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl text-[0px] text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            aria-label="Close new order form"
          >
            <FaTimes className="text-base" />
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

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="text-xs text-slate-500">Press Escape or choose Cancel to leave without saving.</p><div className="flex gap-3">

          <button
            onClick={onClose}
            disabled={saving}
            className="
              rounded-xl
              border border-slate-300 bg-white font-bold text-slate-700
              px-5
              py-2.5
              transition
              hover:bg-slate-50 disabled:opacity-50
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
            <FaCheck className="mr-2 inline" />{saving ? "Saving order..." : "Create order"}
          </button>
          </div>
        </div>

      </div>

    </div>
  );
}
