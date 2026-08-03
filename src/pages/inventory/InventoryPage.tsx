import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { Product } from "../../types/Product";

import { getProducts } from "../../services/productService";

import {
  getStockStatus,
  getInventoryValue,
  getLowStockProducts,
  getOutOfStockProducts,
} from "../../services/inventoryService";

import { exportInventoryCSV }
from "../../services/inventoryExportService";

import InventoryStats
from "../../components/inventory/InventoryStats";

import InventorySearch
from "../../components/inventory/InventorySearch";

import InventoryStatusFilter
from "../../components/inventory/InventoryStatusFilter";

import InventoryTable
from "../../components/inventory/InventoryTable";

import LowStockAlert
from "../../components/inventory/LowStockAlert";

import StockAdjustModal
from "../../components/inventory/StockAdjustModal";

import StockMovementsModal
from "../../components/inventory/StockMovementsModal";

export default function InventoryPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("");

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [adjustOpen, setAdjustOpen] =
    useState(false);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  async function loadProducts() {

    try {

      const data = await getProducts();

      setProducts(data);

    } catch (error) {

      console.error(
        "Error loading inventory:",
        error
      );

      toast.error("Failed to load inventory.");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadProducts();

  }, []);

  const lowStockProducts =
    getLowStockProducts(products);

  const outOfStockProducts =
    getOutOfStockProducts(products);

  const inventoryValue =
    getInventoryValue(products);

  const filteredProducts = products.filter((product) => {

    const term = search.toLowerCase();

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(term) ||

      (product.sku ?? "")
        .toLowerCase()
        .includes(term) ||

      (product.barcode ?? "")
        .toLowerCase()
        .includes(term);

    const matchesFilter =
      filter === ""
        ? true
        : getStockStatus(product) === filter;

    return matchesSearch && matchesFilter;

  });

  if (loading) {

    return (

      <div className="p-8">

        Loading inventory...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Inventory

          </h1>

          <p className="mt-2 text-gray-500">

            Track stock levels and stock movements.

          </p>

        </div>

        <button
          onClick={() =>
            exportInventoryCSV(filteredProducts)
          }
          className="
            rounded-lg
            bg-blue-600
            px-5
            py-2.5
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Export CSV
        </button>

      </div>

      <InventoryStats
        totalProducts={products.length}
        lowStockCount={lowStockProducts.length}
        outOfStockCount={outOfStockProducts.length}
        inventoryValue={inventoryValue}
      />

      <LowStockAlert
        products={lowStockProducts}
        onView={(product) => {
          setSelectedProduct(product);
          setAdjustOpen(true);
        }}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <InventorySearch
          value={search}
          onChange={setSearch}
        />

        <InventoryStatusFilter
          value={filter}
          onChange={setFilter}
        />

      </div>

      <InventoryTable
        products={filteredProducts}
        onAdjust={(product) => {
          setSelectedProduct(product);
          setAdjustOpen(true);
        }}
        onHistory={(product) => {
          setSelectedProduct(product);
          setHistoryOpen(true);
        }}
      />

      <StockAdjustModal
        open={adjustOpen}
        product={selectedProduct}
        onClose={() => setAdjustOpen(false)}
        onSaved={loadProducts}
      />

      <StockMovementsModal
        open={historyOpen}
        product={selectedProduct}
        onClose={() => setHistoryOpen(false)}
      />

    </div>

  );

}
