import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { Expense, PaymentMethod }
from "../../types/Finance";

import type { Supplier } from "../../types/Supplier";

import {
  expenseCategories,
  paymentMethods,
  defaultExpense,
} from "../../data/expenseCategories";

import {
  createExpense,
  updateExpense,
} from "../../services/financeService";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  expense: Expense | null;
  suppliers: Supplier[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ExpenseFormModal({
  open,
  expense,
  suppliers,
  onClose,
  onSaved,
}: Props) {

  const { user } = useAuth();

  const [form, setForm] =
    useState<Expense>(defaultExpense);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!open) {

      return;

    }

    setForm(
      expense
        ? { ...expense }
        : {
            ...defaultExpense,
            date: new Date()
              .toISOString()
              .slice(0, 10),
          }
    );

  }, [open, expense]);

  async function handleSave() {

    if (!form.description.trim()) {

      toast.error("Description is required.");

      return;

    }

    if (form.amount <= 0) {

      toast.error("Amount must be greater than zero.");

      return;

    }

    if (!form.date) {

      toast.error("Date is required.");

      return;

    }

    setSaving(true);

    try {

      if (expense?.id) {

        await updateExpense(
          expense.id,
          form,
          user?.email ?? "Unknown"
        );

        toast.success("Expense updated.");

      } else {

        await createExpense({

          ...form,

          createdBy: user?.email ?? "Unknown",

        });

        toast.success("Expense captured.");

      }

      onSaved();

      onClose();

    } catch (error) {

      console.error(
        "Failed to save expense:",
        error
      );

      toast.error("Failed to save expense.");

    } finally {

      setSaving(false);

    }

  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            {expense ? "Edit Expense" : "Capture Expense"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-black"
          >
            ✕
          </button>

        </div>

        <div className="flex-1 overflow-y-auto p-6">

          <div className="grid gap-4 md:grid-cols-2">

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    description: e.target.value,
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
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    category: e.target.value,
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

                {expenseCategories.map((category) => (

                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Date
              </label>

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    date: e.target.value,
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
                Amount (incl. VAT)
              </label>

              <input
                type="number"
                min={0}
                step="0.01"
                value={form.amount}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    amount: Number(e.target.value),
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
                VAT Amount
              </label>

              <input
                type="number"
                min={0}
                step="0.01"
                value={form.vatAmount}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    vatAmount: Number(e.target.value),
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
                Payment Method
              </label>

              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    paymentMethod:
                      e.target.value as PaymentMethod,
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

                {paymentMethods.map((method) => (

                  <option
                    key={method.value}
                    value={method.value}
                  >
                    {method.label}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Supplier (optional)
              </label>

              <select
                value={form.supplierId ?? ""}
                onChange={(e) => {

                  const supplier = suppliers.find(
                    (item) => item.id === e.target.value
                  );

                  setForm((previous) => ({
                    ...previous,
                    supplierId: e.target.value,
                    supplierName: supplier?.name ?? "",
                  }));

                }}
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
                  None
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
                Reference
              </label>

              <input
                type="text"
                value={form.reference}
                onChange={(e) =>
                  setForm((previous) => ({
                    ...previous,
                    reference: e.target.value,
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

            <div className="md:col-span-2">

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
            {saving ? "Saving..." : "Save Expense"}
          </button>

        </div>

      </div>

    </div>
  );
}
