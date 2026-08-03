import {
  FaTags,
  FaCheckCircle,
  FaEyeSlash,
  FaBoxOpen,
} from "react-icons/fa";

interface Props {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalProducts: number;
}

export default function CategoryStats({
  totalCategories,
  activeCategories,
  inactiveCategories,
  totalProducts,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Total Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {totalCategories}
            </h2>

          </div>

          <div className="rounded-xl bg-blue-100 p-4">

            <FaTags
              className="text-blue-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Active
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {activeCategories}
            </h2>

          </div>

          <div className="rounded-xl bg-green-100 p-4">

            <FaCheckCircle
              className="text-green-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Inactive
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-500">
              {inactiveCategories}
            </h2>

          </div>

          <div className="rounded-xl bg-slate-100 p-4">

            <FaEyeSlash
              className="text-slate-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Products Categorised
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {totalProducts}
            </h2>

          </div>

          <div className="rounded-xl bg-yellow-100 p-4">

            <FaBoxOpen
              className="text-yellow-600"
              size={24}
            />

          </div>

        </div>

      </div>

    </div>
  );
}
