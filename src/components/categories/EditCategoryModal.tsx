import { useEffect, useState } from "react";

import type { Category } from "../../types/Category";

interface Props {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
}

export default function EditCategoryModal({
  open,
  category,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<"active" | "inactive">("active");

  useEffect(() => {
    if (!category) return;

    setName(category.name);
    setDescription(category.description);
    setStatus(category.status);
  }, [category]);

  if (!open || !category) return null;

  function handleSubmit() {

     if (!category) return;
    onSave({
      ...category,
      name,
      description,
      status,
      productCount: category.productCount,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-2xl font-bold">
            Edit Category
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>

        </div>

        <div className="p-6 space-y-5">

          <div>

            <label className="block mb-2 font-medium">
              Category Name
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-3"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    "active" | "inactive"
                )
              }
              className="w-full rounded-xl border px-4 py-3"
            >

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>

          <div className="flex justify-end gap-3">

            <button
              onClick={onClose}
              className="rounded-xl border px-5 py-3"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="rounded-xl bg-amber-500 px-5 py-3 text-white hover:bg-amber-600"
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}