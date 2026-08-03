import { FaExclamationTriangle } from "react-icons/fa";

import type { Product } from "../../types/Product";

interface Props {
  products: Product[];
  onView: (product: Product) => void;
}

export default function LowStockAlert({
  products,
  onView,
}: Props) {

  if (products.length === 0) return null;

  return (
    <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <FaExclamationTriangle
          className="text-yellow-600"
          size={20}
        />

        <h3 className="text-lg font-semibold text-yellow-800">
          {products.length} product{products.length !== 1 ? "s" : ""} need restocking
        </h3>

      </div>

      <div className="mt-4 flex flex-wrap gap-2">

        {products.slice(0, 12).map((product) => (

          <button
            key={product.id}
            onClick={() => onView(product)}
            className="
              rounded-lg
              border
              border-yellow-300
              bg-white
              px-3
              py-2
              text-sm
              font-medium
              transition
              hover:bg-yellow-100
            "
          >

            {product.name}

            <span className="ml-2 text-yellow-700">
              ({product.stock ?? 0})
            </span>

          </button>

        ))}

        {products.length > 12 && (

          <span className="px-3 py-2 text-sm text-yellow-700">
            + {products.length - 12} more
          </span>

        )}

      </div>

    </div>
  );
}
