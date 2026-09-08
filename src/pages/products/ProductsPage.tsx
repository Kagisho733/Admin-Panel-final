/*
|--------------------------------------------------------------------------
| Products Page
|--------------------------------------------------------------------------
| Displays all products from Firebase Firestore.
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";

import type { Product } from "../../types/Product";

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import ProductTable from "../../components/products/ProductTable";

import ProductSearch from "../../components/products/ProductSearch";

import CategoryFilter from "../../components/products/CategoryFilter";

import AddProductButton from "../../components/products/AddProductButton";
import AddProductModal from "../../components/products/AddProductModal";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ProductsPage() {

  const { user } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [merchandising, setMerchandising] = useState<"" | "featured" | "new" | "best-seller">("");

  const [openModal, setOpenModal] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [deleteProductTarget, setDeleteProductTarget] =
    useState<Product | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [sortField, setSortField] = useState<
    "name" | "price" | "stock" | "category"
  >("name");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] =
    useState(1);


  const productsPerPage = 10;
  /*
  |--------------------------------------------------------------------------
  | Load Products
  |--------------------------------------------------------------------------
  */

  async function loadProducts() {

    try {

      const data = await getProducts();

      setProducts(data);

    } catch (error) {

      console.error("Error loading products:", error);

    } finally {

      setLoading(false);

    }

  }

  async function handleSaveProduct(product: Product) {

    try {

      if (product.id) {

        // Update existing product

        await updateProduct(
          product.id,
          product,
          user?.email ?? "Unknown"
        );

      } else {

        // Create new product

        await createProduct(
          product,
          user?.email ?? "Unknown"
        );

      }

      setOpenModal(false);

      setEditingProduct(null);

      await loadProducts();

    } catch (error) {

      console.error(error);

      toast.error("Failed to save product.");

    }

  }

  function handleDeleteProduct(product: Product) {

    setDeleteProductTarget(product);

    setDeleteModalOpen(true);

  }

  async function confirmDeleteProduct() {

    if (!deleteProductTarget?.id) return;

    try {

      await deleteProduct(
        deleteProductTarget.id,
        user?.email ?? "Unknown",
        deleteProductTarget.name
      );

      toast.success("Product deleted successfully.");

      setDeleteModalOpen(false);

      setDeleteProductTarget(null);

      await loadProducts();

    } catch (error) {

      console.error(error);

      toast.error("Failed to delete product.");

    }

  }


  function handleEditProduct(product: Product) {

    setEditingProduct(product);

    setOpenModal(true);

  }

  /*
  |--------------------------------------------------------------------------
  | Load Once
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadProducts();

  }, []);

  useEffect(() => {

    setCurrentPage(1);

  }, [search, category, merchandising]);

  /*
  |--------------------------------------------------------------------------
  | Filter Products
  |--------------------------------------------------------------------------
  */

  const filteredProducts = products.filter((product) => {

    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "" ||
      product.category === category;

    const matchesMerchandising = merchandising === "" ||
      (merchandising === "featured" && product.featured) ||
      (merchandising === "new" && product.isNew) ||
      (merchandising === "best-seller" && product.isBestSeller);

    return matchesSearch && matchesCategory && matchesMerchandising;

  });

  const sortedProducts = [...filteredProducts].sort(
    (a, b) => {

      const direction =
        sortDirection === "asc" ? 1 : -1;

      switch (sortField) {

        case "name":
          return (
            a.name.localeCompare(b.name)
          ) * direction;

        case "category":
          return (
            a.category.localeCompare(b.category)
          ) * direction;

        case "price":
          return (
            (a.price - b.price)
          ) * direction;

        case "stock":
          return (
            (a.stock - b.stock)
          ) * direction;

        default:
          return 0;

      }

    }
  );

  /*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

  const totalPages = Math.ceil(
    sortedProducts.length / productsPerPage
  );

  const indexOfLastProduct =
    currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage;

  const paginatedProducts =
    sortedProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  function goToNextPage() {

    if (currentPage < totalPages) {

      setCurrentPage((prev) => prev + 1);

    }

  }

  function goToPreviousPage() {

    if (currentPage > 1) {

      setCurrentPage((prev) => prev - 1);

    }

  }


  function goToPage(page: number) {

    setCurrentPage(page);

  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between gap-4">

        <div>

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                Products
              </h1>

              <p className="mt-2 text-gray-500">
                Manage your inventory
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {products.length} products available
              </p>

            </div>

          </div>

        </div>

        <AddProductButton

          onClick={() => {

            setOpenModal(true);

          }}

        />

      </div>

      {/* Search & Filter */}

      <div className="flex flex-col md:flex-row gap-4">

        <ProductSearch

          value={search}

          onChange={setSearch}

        />

        <CategoryFilter

          value={category}

          onChange={setCategory}

        />

        <select value={merchandising} onChange={(event) => setMerchandising(event.target.value as typeof merchandising)} className="min-h-12 rounded-xl border border-slate-300 bg-white px-4 font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
          <option value="">All merchandising</option>
          <option value="featured">Featured products</option>
          <option value="new">New arrivals</option>
          <option value="best-seller">Best sellers</option>
        </select>

      </div>
      {loading ? (

        <div className="bg-white rounded-2xl shadow-lg p-10">

          <div className="flex flex-col items-center justify-center py-12">

            <div className="
        h-12
        w-12
        animate-spin
        rounded-full
        border-4
        border-blue-600
        border-t-transparent
      " />

            <h3 className="mt-6 text-xl font-semibold">

              Loading Products...

            </h3>

            <p className="mt-2 text-gray-500">

              Please wait while we load your inventory.

            </p>

          </div>

        </div>

      ) : (

        <>
          <ProductTable
            products={paginatedProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            sortField={sortField}
            sortDirection={sortDirection}
            setSortField={setSortField}
            setSortDirection={setSortDirection}
          />

          <div className="flex items-center justify-between mt-6">

            <p className="text-gray-600">

              Showing{" "}
              {sortedProducts.length === 0
                ? 0
                : indexOfFirstProduct + 1}
              –
              {Math.min(
                indexOfLastProduct,
                sortedProducts.length
              )}{" "}
              of {sortedProducts.length} products

            </p>

            <div className="flex gap-3 items-center">

              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="
      px-4 py-2 rounded-lg border
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">

                {pageNumbers.map((page) => (

                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`
          px-3 py-1 rounded-lg border
          ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                      }
        `}
                  >

                    {page}

                  </button>

                ))}

              </div>

              <button
                onClick={goToNextPage}
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                className="
      px-4 py-2 rounded-lg border
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
              >
                Next
              </button>

            </div>

          </div>
        </>

      )}

      <AddProductModal
        open={openModal}
        onClose={() => {

          setOpenModal(false);

          setEditingProduct(null);

        }}
        onSave={handleSaveProduct}
        initialProduct={editingProduct ?? undefined}
      />

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Product"
        message={
          deleteProductTarget
            ? `Are you sure you want to delete "${deleteProductTarget.name}"?`
            : ""
        }
        confirmText="Delete Product"
        cancelText="Cancel"
        onCancel={() => {

          setDeleteModalOpen(false);

          setDeleteProductTarget(null);

        }}
        onConfirm={confirmDeleteProduct}
      />



    </div>

  );

}

