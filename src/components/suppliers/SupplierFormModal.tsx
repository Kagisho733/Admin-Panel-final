import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { Supplier } from "../../types/Supplier";

import type { SupplierErrors }
from "../../validation/supplierValidation";

import { validateSupplier }
from "../../validation/supplierValidation";

import {
  defaultSupplier,
  paymentTermsOptions,
} from "../../data/defaultSupplier";

import {
  createSupplier,
  updateSupplier,
} from "../../services/supplierService";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  open: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function SupplierFormModal({
  open,
  supplier,
  onClose,
  onSaved,
}: Props) {

  const { user } = useAuth();

  const [form, setForm] =
    useState<Supplier>(defaultSupplier);

  const [errors, setErrors] =
    useState<SupplierErrors>({});

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    if (!open) {

      return;

    }

    setErrors({});

    setForm(
      supplier
        ? { ...supplier }
        : { ...defaultSupplier }
    );

  }, [open, supplier]);

  function updateField(
    field: keyof Supplier,
    value: string
  ) {

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

  }

  async function handleSave() {

    const validationErrors = validateSupplier(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {

      toast.error("Please fix the highlighted fields.");

      return;

    }

    setSaving(true);

    try {

      if (supplier?.id) {

        await updateSupplier(
          supplier.id,
          form,
          user?.email ?? "Unknown"
        );

        toast.success("Supplier updated.");

      } else {

        await createSupplier(
          form,
          user?.email ?? "Unknown"
        );

        toast.success("Supplier created.");

      }

      onSaved();

      onClose();

    } catch (error) {

      console.error(
        "Failed to save supplier:",
        error
      );

      toast.error("Failed to save supplier.");

    } finally {

      setSaving(false);

    }

  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            {supplier ? "Edit Supplier" : "Add Supplier"}
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

            <div>

              <label className="mb-2 block text-sm font-medium">
                Supplier Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  updateField("name", e.target.value)
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

              {errors.name && (

                <p className="mt-2 text-sm text-red-600">
                  {errors.name}
                </p>

              )}

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Contact Person
              </label>

              <input
                type="text"
                value={form.contactPerson}
                onChange={(e) =>
                  updateField("contactPerson", e.target.value)
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

              {errors.contactPerson && (

                <p className="mt-2 text-sm text-red-600">
                  {errors.contactPerson}
                </p>

              )}

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
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

              {errors.email && (

                <p className="mt-2 text-sm text-red-600">
                  {errors.email}
                </p>

              )}

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value)
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

              {errors.phone && (

                <p className="mt-2 text-sm text-red-600">
                  {errors.phone}
                </p>

              )}

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Address
              </label>

              <input
                type="text"
                value={form.address}
                onChange={(e) =>
                  updateField("address", e.target.value)
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
                City
              </label>

              <input
                type="text"
                value={form.city}
                onChange={(e) =>
                  updateField("city", e.target.value)
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
                Province
              </label>

              <input
                type="text"
                value={form.province}
                onChange={(e) =>
                  updateField("province", e.target.value)
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
                Postal Code
              </label>

              <input
                type="text"
                value={form.postalCode}
                onChange={(e) =>
                  updateField("postalCode", e.target.value)
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
                VAT Number
              </label>

              <input
                type="text"
                value={form.vatNumber}
                onChange={(e) =>
                  updateField("vatNumber", e.target.value)
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
                Payment Terms
              </label>

              <select
                value={form.paymentTerms}
                onChange={(e) =>
                  updateField("paymentTerms", e.target.value)
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

                {paymentTermsOptions.map((option) => (

                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>

                ))}

              </select>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value)
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

                <option value="active">Active</option>

                <option value="inactive">Inactive</option>

              </select>

            </div>

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium">
                Notes
              </label>

              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  updateField("notes", e.target.value)
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
            {saving ? "Saving..." : "Save Supplier"}
          </button>

        </div>

      </div>

    </div>
  );
}
