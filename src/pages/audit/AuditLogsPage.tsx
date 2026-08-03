import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { AuditLog } from "../../types/AuditLog";

import { getAuditLogs } from "../../services/auditLogService";

import { exportReportCSV } from "../../services/reportService";

import AuditLogsTable
from "../../components/audit/AuditLogsTable";

import Pagination
from "../../components/common/Pagination";

export default function AuditLogsPage() {

  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [moduleFilter, setModuleFilter] =
    useState("");

  const [actionFilter, setActionFilter] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(25);

  async function loadLogs() {

    try {

      const data = await getAuditLogs();

      setLogs(data);

    } catch (error) {

      console.error(
        "Error loading audit logs:",
        error
      );

      toast.error("Failed to load audit logs.");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadLogs();

  }, []);

  useEffect(() => {

    setCurrentPage(1);

  }, [
    search,
    moduleFilter,
    actionFilter,
    rowsPerPage,
  ]);

  const filteredLogs = logs.filter((log) => {

    const term = search.toLowerCase();

    const matchesSearch =
      log.description
        .toLowerCase()
        .includes(term) ||

      log.entityName
        .toLowerCase()
        .includes(term) ||

      log.performedBy
        .toLowerCase()
        .includes(term);

    const matchesModule =
      moduleFilter === ""
        ? true
        : log.module === moduleFilter;

    const matchesAction =
      actionFilter === ""
        ? true
        : log.action === actionFilter;

    return matchesSearch && matchesModule && matchesAction;

  });

  const totalPages = Math.ceil(
    filteredLogs.length / rowsPerPage
  );

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  function handleExport() {

    exportReportCSV(
      [
        "Date",
        "Action",
        "Module",
        "Entity",
        "Description",
        "Performed By",
      ],
      filteredLogs.map((log) => [
        log.createdAt?.toDate
          ? log.createdAt.toDate().toISOString()
          : String(log.createdAt ?? ""),
        log.action,
        log.module,
        log.entityName,
        log.description,
        log.performedBy,
      ]),
      `audit-logs-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    toast.success("Audit logs exported.");

  }

  if (loading) {

    return (

      <div className="p-8">

        Loading audit logs...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Audit Logs

          </h1>

          <p className="mt-2 text-gray-500">

            Every important action performed in the system.

          </p>

        </div>

        <button
          onClick={handleExport}
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="w-full md:w-96">

          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              shadow-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
            "
          />

        </div>

        <div className="flex flex-wrap gap-3">

          <select
            value={moduleFilter}
            onChange={(e) =>
              setModuleFilter(e.target.value)
            }
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              shadow-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
            "
          >

            <option value="">All Modules</option>

            <option value="products">Products</option>

            <option value="categories">Categories</option>

            <option value="orders">Orders</option>

            <option value="customers">Customers</option>

            <option value="users">Users</option>

            <option value="inventory">Inventory</option>

            <option value="suppliers">Suppliers</option>

            <option value="purchasing">Purchasing</option>

            <option value="finance">Finance</option>

            <option value="settings">Settings</option>

            <option value="auth">Auth</option>

          </select>

          <select
            value={actionFilter}
            onChange={(e) =>
              setActionFilter(e.target.value)
            }
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              shadow-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
            "
          >

            <option value="">All Actions</option>

            <option value="create">Create</option>

            <option value="update">Update</option>

            <option value="delete">Delete</option>

            <option value="status">Status</option>

            <option value="login">Login</option>

            <option value="logout">Logout</option>

            <option value="export">Export</option>

          </select>

        </div>

      </div>

      <AuditLogsTable logs={paginatedLogs} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
        totalItems={filteredLogs.length}
      />

    </div>

  );

}
