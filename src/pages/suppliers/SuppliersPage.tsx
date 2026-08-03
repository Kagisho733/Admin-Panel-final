import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { Supplier } from "../../types/Supplier";

import {
  getSuppliers,
  deleteSupplier,
  exportSuppliersCSV,
} from "../../services/supplierService";

import SupplierStats
from "../../components/suppliers/SupplierStats";

import SupplierSearch
from "../../components/suppliers/SupplierSearch";

import SupplierStatusFilter
from "../../components/suppliers/SupplierStatusFilter";

import SuppliersTable
from "../../components/suppliers/SuppliersTable";

import SupplierFormModal
from "../../components/suppliers/SupplierFormModal";

import SupplierDetailsModal
from "../../components/suppliers/SupplierDetailsModal";

import ConfirmModal
from "../../components/common/ConfirmModal";

import { useAuth } from "../../hooks/useAuth";

export default function SuppliersPage() {

  const { user } = useAuth();

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("");

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  async function loadSuppliers() {

    try {

      const data = await getSuppliers();

      setSuppliers(data);

    } catch (error) {

      console.error(
        "Error loading suppliers:",
        error
      );

      toast.error("Failed to load suppliers.");

    } finally {

      setLoading(false);

    }

  }

  async function handleDelete() {

    if (!selectedSupplier?.id) {

      return;

    }

    try {

      await deleteSupplier(
        selectedSupplier.id,
        selectedSupplier.name,
        user?.email ?? "Unknown"
      );

      await loadSuppliers();

      toast.success("Supplier deleted.");

    } catch (error) {

      console.error(
        "Failed to delete supplier:",
        error
      );

      toast.error("Failed to delete supplier.");

    } finally {

      setConfirmOpen(false);

    }

  }

  useEffect(() => {

    loadSuppliers();

  }, []);

  const activeSuppliers = suppliers.filter(
    (supplier) => supplier.status === "active"
  ).length;

  const totalSpent = suppliers.reduce(
    (sum, supplier) =>
      sum + (supplier.totalSpent ?? 0),
    0
  );

  const totalOrders = suppliers.reduce(
    (sum, supplier) =>
      sum + (supplier.totalOrders ?? 0),
    0
  );

  const filteredSuppliers = suppliers.filter((supplier) => {

    const term = search.toLowerCase();

    const matchesSearch =
      supplier.name
        .toLowerCase()
        .includes(term) ||

      supplier.contactPerson
        .toLowerCase()
        .includes(term) ||

      supplier.email
        .toLowerCase()
        .includes(term) ||

      supplier.phone
        .toLowerCase()
        .includes(term);

    const matchesFilter =
      filter === ""
        ? true
        : supplier.status === filter;

    return matchesSearch && matchesFilter;

  });

  if (loading) {

    return (

      <div className="p-8">

        Loading suppliers...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Suppliers

          </h1>

          <p className="mt-2 text-gray-500">

            Manage the businesses you buy stock from.

          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() =>
              exportSuppliersCSV(filteredSuppliers)
            }
            className="
              rounded-lg
              bg-slate-100
              px-5
              py-2.5
              transition
              hover:bg-slate-200
            "
          >
            Export CSV
          </button>

          <button
            onClick={() => {
              setSelectedSupplier(null);
              setFormOpen(true);
            }}
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
            + Add Supplier
          </button>

        </div>

      </div>

      <SupplierStats
        totalSuppliers={suppliers.length}
        activeSuppliers={activeSuppliers}
        totalSpent={totalSpent}
        totalOrders={totalOrders}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <SupplierSearch
          value={search}
          onChange={setSearch}
        />

        <SupplierStatusFilter
          value={filter}
          onChange={setFilter}
        />

      </div>

      <SuppliersTable
        suppliers={filteredSuppliers}
        onView={(supplier) => {
          setSelectedSupplier(supplier);
          setDetailsOpen(true);
        }}
        onEdit={(supplier) => {
          setSelectedSupplier(supplier);
          setFormOpen(true);
        }}
        onDelete={(supplier) => {
          setSelectedSupplier(supplier);
          setConfirmOpen(true);
        }}
      />

      <SupplierFormModal
        open={formOpen}
        supplier={selectedSupplier}
        onClose={() => setFormOpen(false)}
        onSaved={loadSuppliers}
      />

      <SupplierDetailsModal
        open={detailsOpen}
        supplier={selectedSupplier}
        onClose={() => setDetailsOpen(false)}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Supplier"
        message={`Are you sure you want to delete ${selectedSupplier?.name ?? "this supplier"}?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>

  );

}
