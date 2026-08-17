import { useEffect, useState } from "react";

import type { Order } from "../../types/Order";

import { getOrders } from "../../services/orderService";

import OrdersTable from "../../components/orders/OrdersTable";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import OrderStats from "../../components/orders/OrderStats";
import OrderSearch from "../../components/orders/OrderSearch";
import OrderStatusFilter from "../../components/orders/OrderStatusFilter";
import OrdersTableSkeleton from "../../components/orders/OrdersTableSkeleton";
import Pagination from "../../components/common/Pagination";
import BulkActions from "../../components/orders/BulkActions";
import { exportOrdersToCSV } from "../../services/exportService";
import { printOrders } from "../../services/printService";
import { generateInvoice } from "../../services/invoiceService";

export default function OrdersPage() {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  function handleViewOrder(order: Order) {

    setSelectedOrder(order);

    setDetailsOpen(true);

  }

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [sortField, setSortField] = useState<
    "id" | "customer" | "status" | "total" | "date"
  >("date");



  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [selectedOrders, setSelectedOrders] =
    useState<string[]>([]);


  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "pending" ||
      order.status === "processing"
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      order.status === "delivered"
  ).length;

  const revenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const filteredOrders = [...orders]

    .filter((order) => {

      const matchesSearch =
        order.customerName
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        order.customerEmail
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        order.id
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;

    })

    .sort((a, b) => {

      let comparison = 0;

      switch (sortField) {

        case "id":

          comparison =
            (a.id ?? "").localeCompare(b.id ?? "");

          break;

        case "customer":

          comparison =
            a.customerName.localeCompare(
              b.customerName
            );

          break;

        case "status":

          comparison =
            a.status.localeCompare(b.status);

          break;

        case "total":

          comparison =
            a.totalAmount - b.totalAmount;

          break;

        case "date":

          comparison =
            new Date(a.createdAt?.toDate?.() ?? a.createdAt ?? 0).getTime()
            -
            new Date(b.createdAt?.toDate?.() ?? b.createdAt ?? 0).getTime();

          break;

      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;

    });

  const totalPages = Math.ceil(
    filteredOrders.length / rowsPerPage
  );

  const startIndex =
    (currentPage - 1) * rowsPerPage;

  const paginatedOrders =
    filteredOrders.slice(
      startIndex,
      startIndex + rowsPerPage
    );

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "";

  async function loadOrders() {

    try {

      const data = await getOrders();

      setOrders(data);

    } catch (error) {

      console.error(
        "Error loading orders:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  function toggleOrder(orderId: string) {

    setSelectedOrders((previous) =>

      previous.includes(orderId)
        ? previous.filter((id) => id !== orderId)
        : [...previous, orderId]

    );

  }

  function toggleAllOrders() {

    if (selectedOrders.length === paginatedOrders.length) {

      setSelectedOrders([]);

      return;

    }

    setSelectedOrders(

      paginatedOrders
        .map((order) => order.id!)
        .filter(Boolean)

    );

  }


  function handleExportCSV() {
    exportOrdersToCSV(filteredOrders);
  }

  function handleGenerateInvoice(order: Order) {
  generateInvoice(order);
}

  useEffect(() => {

    loadOrders();

  }, []);

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  function handlePrintOrders() {
    printOrders(filteredOrders);
  }

  if (loading) {



    return (

      <div className="space-y-8">

        <div>

          <h1 className="text-3xl font-bold">

            Orders

          </h1>

          <p className="mt-2 text-gray-500">

            Manage customer orders.

          </p>

        </div>

        <OrdersTableSkeleton />

      </div>

    );

  }

  return (

    <div className="space-y-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Orders

          </h1>

          <p className="text-gray-500 mt-2">

            Manage customer orders.

          </p>

        </div>

        <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">Orders are created by customers at checkout. Admins manage fulfilment here.</p>

      </div>

      <div className="space-y-8">

        <div>

        </div>

        <OrderStats
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          completedOrders={completedOrders}
          revenue={revenue}
        />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <OrderSearch
            value={search}
            onChange={setSearch}
          />

          <OrderStatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
          />

        </div>


      </div>


      <BulkActions
        selectedCount={selectedOrders.length}
        onExport={handleExportCSV}
        onPrint={handlePrintOrders}
        onClearSelection={() => {
          setSelectedOrders([]);
        }}
      />





      <OrdersTable
        orders={paginatedOrders}
        onView={handleViewOrder}

        hasFilters={hasFilters}

        sortField={sortField}
        sortDirection={sortDirection}
        setSortField={setSortField}
        setSortDirection={setSortDirection}

        selectedOrders={selectedOrders}
        toggleOrder={toggleOrder}
        toggleAllOrders={toggleAllOrders}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={filteredOrders.length}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {

          setRowsPerPage(rows);

          setCurrentPage(1);

        }}
      />


      <OrderDetailsModal
        open={detailsOpen}
        order={selectedOrder}
        onClose={() => {

          setDetailsOpen(false);

          setSelectedOrder(null);

        }}
        onStatusUpdated={loadOrders}
        onGenerateInvoice={handleGenerateInvoice}
      />

    </div>

  );



}

