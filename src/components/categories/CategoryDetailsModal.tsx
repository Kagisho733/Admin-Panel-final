import type { Category } from "../../types/Category";

interface Props {

  open: boolean;

  category: Category | null;

  onClose: () => void;

}

export default function CategoryDetailsModal({

  open,

  category,

  onClose,

}: Props) {

  if (!open || !category) return null;

  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">

        <div className="flex justify-between items-center border-b p-6">

          <h2 className="text-2xl font-bold">

            Category Details

          </h2>

          <button

            onClick={onClose}

            className="text-gray-500 hover:text-black"

          >

            ✕

          </button>

        </div>

        <div className="p-6 space-y-6">

          <div className="rounded-xl border p-5">

            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

              Category Name

            </h3>

            <p className="mt-2 text-lg font-medium">

              {category.name}

            </p>

          </div>

          <div className="rounded-xl border p-5">

            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

              Description

            </h3>

            <p className="mt-2">

              {category.description}

            </p>

          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="rounded-xl border p-5">

              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

                Products

              </h3>

              <p className="mt-2 text-2xl font-bold">

                {category.productCount}

              </p>

            </div>

            <div className="rounded-xl border p-5">

              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

                Status

              </h3>

              <span
                className={`
                  mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold
                  ${
                    category.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >

                {category.status}

              </span>

            </div>

          </div>

          <button

            onClick={onClose}

            className="mt-2 rounded-xl bg-gray-800 px-6 py-3 text-white hover:bg-black"

          >

            Close

          </button>

        </div>

      </div>

    </div>

  );

}