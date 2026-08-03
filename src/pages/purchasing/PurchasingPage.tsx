import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { PurchaseOrder } from "../../types/PurchaseOrder";

import type { Supplier } from "../../types/Supplier";

import type { Product } from "../../types/Product";

import {
  getPurchaseOrders,
  deletePurchaseOrder,
} from "../../services/purchaseOrderService";

import { getSuppliers } from "../../services/supplierService";

import { getProducts } from "../../services/productService";

import PurchaseStats
from "../../components/purchasing/PurchaseStats";

import PurchaseSearch
from "../../components/purchasing/PurchaseSearch";

import PurchaseStatusFilter
from "../../components/purchasing/PurchaseStatusFilter";

import PurchaseOrdersTable
from "../../components/purchasing/PurchaseOrdersTable";

import PurchaseOrderFormModal
from "../../components/purchasing/PurchaseOrderFormModal";

import PurchaseOrderDetailsModal
from "../../components/purchasing/PurchaseOrderDetailsModal";

import ConfirmModal
from "../../components/common/ConfirmModal";

import { useAuth } from "../../hooks/useAuth";

export default function PurchasingPage() {

  const { user } = useAuth();

  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>([]);

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrder | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  async function loadData() {

    try {

      const [orderData, supplierData, productData] =
        await Promise.all([
          getPurchaseOrders(),
          getSuppliers(),
          getProducts(),
        ]);

      setPurchaseOrders(orderData);

      setSuppliers(supplierData);

      setProducts(productData);

    } catch (error) {

      console.error(
        "Error loading purchasing data:",
        error
      );

      toast.error("Failed to load purchase orders.");

    } finally {

      setLoading(false);

    }

  }

  async function handleDelete() {

    if (!selectedOrder?.id) {

      return;

    }

    try {

      await deletePurchaseOrder(
        selectedOrder.id,
        selectedOrder.poNumber,
        user?.email ?? "Unknown"
      );

      await loadData();

      toast.success("Purchase order deleted.");

    } catch (error) {

      console.error(
        "Failed to delete purchase order:",
        error
      );

      toast.error("Failed to delete purchase order.");

    } finally {

      setConfirmOpen(false);

    }

  }

  useEffect(() => {

    loadData();

  }, []);

  const pendingOrders = purchaseOrders.filter(
    (order) =>
      order.status === "ordered" ||
      order.status === "partially-received"
  ).length;

  const receivedOrders = purchaseOrders.filter(
    (order) => order.status === "received"
  ).length;

  const totalValue = purchaseOrders
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (sum, order) => sum + (order.totalAmount ?? 0),
      0
    );

  const filteredOrders = purchaseOrders.filter((order) => {

    const term = search.toLowerCase();

    const matchesSearch =
      order.poNumber
        .toLowerCase()
        .includes(term) ||

      order.supplierName
        .toLowerCase()
        .includes(term);

    const matchesFilter =
      filter === ""
        ? true
        : order.status === filter;

    return matchesSearch && matchesFilter;

  });

  if (loading) {

    return (

      <div className="p-8">

        Loading purchase orders...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Purchasing

          </h1>

          <p className="mt-2 text-gray-500">

            Order stock from suppliers and receive it into inventory.

          </p>

        </div>

        <button
          onClick={() => setFormOpen(true)}
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
          + New Purchase Order
        </button>

      </div>

      <PurchaseStats
        totalOrders={purchaseOrders.length}
        pendingOrders={pendingOrders}
        receivedOrders={receivedOrders}
        totalValue={totalValue}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <PurchaseSearch
          value={search}
          onChange={setSearch}
        />

        <PurchaseStatusFilter
          value={filter}
          onChange={setFilter}
        />

      </div>

      <PurchaseOrdersTable
        purchaseOrders={filteredOrders}
        onView={(order) => {
          setSelectedOrder(order);
          setDetailsOpen(true);
        }}
        onDelete={(order) => {
          setSelectedOrder(order);
          setConfirmOpen(true);
        }}
      />

      <PurchaseOrderFormModal
        open={formOpen}
        suppliers={suppliers}
        products={products}
        onClose={() => setFormOpen(false)}
        onSaved={loadData}
      />

      <PurchaseOrderDetailsModal
        open={detailsOpen}
        purchaseOrder={selectedOrder}
        onClose={() => setDetailsOpen(false)}
        onSaved={loadData}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Purchase Order"
        message={`Are you sure you want to delete ${selectedOrder?.poNumber ?? "this order"}?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>

  );

}
