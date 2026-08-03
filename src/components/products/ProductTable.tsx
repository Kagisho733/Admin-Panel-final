/*
|--------------------------------------------------------------------------
| Product Table
|--------------------------------------------------------------------------
*/

import type { Product } from "../../types/Product";

interface Props {

  products: Product[];

  onEdit: (product: Product) => void;

  onDelete: (product: Product) => void;

  sortField:
  | "name"
  | "price"
  | "stock"
  | "category";

  sortDirection:
  | "asc"
  | "desc";

  setSortField: React.Dispatch<
    React.SetStateAction<
      "name"
      | "price"
      | "stock"
      | "category"
    >
  >;

  setSortDirection: React.Dispatch<
    React.SetStateAction<
      "asc" | "desc"
    >
  >;

}

export default function ProductTable({

  products,

  onEdit,

  onDelete,

  sortField,

  sortDirection,

  setSortField,

  setSortDirection,

}: Props) {

  function handleSort(
    field: "name" | "price" | "stock" | "category"
  ) {

    if (sortField === field) {

      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);

      setSortDirection("asc");

    }

  }
  return (

    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th
              onClick={() => handleSort("name")}
              className="
    p-4
    text-left
    cursor-pointer
    select-none
    hover:bg-slate-200
    transition
  "
            >

              <div className="flex items-center gap-2">

                Product

                {sortField === "name" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th
              onClick={() => handleSort("category")}
              className="
    p-4
    text-left
    cursor-pointer
    select-none
    hover:bg-slate-200
    transition
  "
            >

              <div className="flex items-center gap-2">

                Category

                {sortField === "category" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th
              onClick={() => handleSort("price")}
              className="
    p-4
    text-left
    cursor-pointer
    select-none
    hover:bg-slate-200
    transition
  "
            >

              <div className="flex items-center gap-2">

                Price

                {sortField === "price" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th
              onClick={() => handleSort("stock")}
              className="
    p-4
    text-left
    cursor-pointer
    select-none
    hover:bg-slate-200
    transition
  "
            >

              <div className="flex items-center gap-2">

                Stock

                {sortField === "stock" && (

                  <span>

                    {sortDirection === "asc"
                      ? "▲"
                      : "▼"}

                  </span>

                )}

              </div>

            </th>

            <th className="p-4 text-left">

              Status

            </th>

            <th className="p-4 text-center">

              Actions

            </th>

          </tr>

        </thead>

        <tbody>

          {products.length === 0 ? (

            <tr>

              <div className="py-16 text-center">

                <div className="text-6xl mb-4">
                  📦
                </div>

                <h3 className="text-xl font-semibold">
                  No products found
                </h3>

                <p className="mt-2 text-gray-500">
                  Start by adding your first product.
                </p>

              </div>

            </tr>

          ) : (

            products.map((product) => (

              <tr
                key={product.id}
                className="border-t hover:bg-slate-50 transition-colors"
              >

                <td className="p-4">

                  <div className="flex items-center gap-4">

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="
        w-16
        h-16
        rounded-xl
        object-cover
        border
        bg-gray-100
      "
                    />

                    <div>

                      <h3 className="font-semibold text-gray-900">

                        {product.name}

                      </h3>

                      <p className="text-sm text-gray-500">

                        SKU: {product.sku}

                      </p>

                    </div>

                  </div>

                </td>

                <td className="p-4">

                  {product.category}

                </td>

                <td className="p-4">

                  R {product.price.toLocaleString()}

                </td>

                <td className="p-4">

                  <span
                    className={`
      inline-flex
      items-center
      px-3
      py-1
      rounded-full
      text-sm
      font-semibold
      ${product.stock === 0
                        ? "bg-red-100 text-red-700"
                        : product.stock <= product.minStock
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }
    `}
                  >

                    {product.stock}

                  </span>

                </td>

                <td className="p-4">

                  <span
                    className={`
      inline-flex
      items-center
      px-3
      py-1
      rounded-full
      text-sm
      font-medium
      ${product.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }
    `}
                  >

                    {product.status}

                  </span>

                </td>

                <td className="p-4">

                  <div className="flex items-center justify-center gap-3">

                    <button
                      onClick={() => onEdit(product)}
                      className="
        px-4
        py-2
        rounded-lg
        bg-blue-100
        text-blue-700
        hover:bg-blue-200
        transition
        text-sm
        font-medium
      "
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => onDelete(product)}
                      className="
        px-4
        py-2
        rounded-lg
        bg-red-100
        text-red-700
        hover:bg-red-200
        transition
        text-sm
        font-medium
      "
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>



      </table>




    </div>

  );

}