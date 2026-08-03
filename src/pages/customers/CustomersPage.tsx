import { useEffect, useState } from "react";

import type { Customer } from "../../types/Customer";

import CustomerStats from "../../components/customers/CustomerStats";

import {
  getCustomers,
  deleteCustomers,
} from "../../services/customerService";

import CustomerStatusFilter from "../../components/customers/CustomerStatusFilter";

import CustomerTable from "../../components/customers/CustomersTable";
import CustomerSearch from "../../components/customers/CustomerSearch";
import CustomerDetailsModal from "../../components/customers/CustomerDetailsModal";
import CustomerBulkActions from "../../components/customers/CustomerBulkActions";
import CustomersTableSkeleton from "../../components/customers/CustomersTableSkeleton";
import { exportCustomersCSV }
from "../../services/customerExportService";
import {
  emailCustomers,
} from "../../services/customerEmailService";
import toast from "react-hot-toast";



export default function CustomersPage() {

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("");

  const [sortField, setSortField] =
    useState<
      "customer" |
      "orders" |
      "spent" |
      "lastOrder"
    >("customer");

    

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");


  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) =>
      (customer.totalOrders ?? 0) > 0
  ).length;

  const totalRevenue = customers.reduce(
    (sum, customer) =>
      sum + (customer.totalSpent ?? 0),
    0
  );

  const topCustomer =
    customers.length === 0
      ? "-"
      : [...customers]
        .sort(
          (a, b) =>
            (b.totalSpent ?? 0) -
            (a.totalSpent ?? 0)
        )[0].fullName;

  const filteredCustomers = customers

    .filter((customer) => {

      const matchesSearch =

        customer.fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        customer.email
          .toLowerCase()
          .includes(search.toLowerCase()) ||

        (customer.phone ?? "")
          .toLowerCase()
          .includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "active") {

        matchesFilter =
          customer.totalOrders > 0;

      }

      if (filter === "new") {

        matchesFilter =
          customer.totalOrders === 0;

      }

      return matchesSearch && matchesFilter;

    })

    .sort((a, b) => {

      let comparison = 0;

      switch (sortField) {

        case "customer":

          comparison =
            a.fullName.localeCompare(
              b.fullName
            );

          break;

        case "orders":

          comparison =
            a.totalOrders -
            b.totalOrders;

          break;

        case "spent":

          comparison =
            a.totalSpent -
            b.totalSpent;

          break;

        case "lastOrder":

          comparison =
            new Date(
              a.lastOrderDate?.toDate?.() ??
              a.lastOrderDate ??
              0
            ).getTime()

            -

            new Date(
              b.lastOrderDate?.toDate?.() ??
              b.lastOrderDate ??
              0
            ).getTime();

          break;

      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;

    });




    

  const [loading, setLoading] =
    useState(true);

  const [selectedCustomers, setSelectedCustomers] =
    useState<string[]>([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  async function loadCustomers() {

    try {

      const data =
        await getCustomers();

      setCustomers(data);

    } catch (error) {

      console.error(
        "Error loading customers:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  function toggleCustomer(customerId: string) {

    setSelectedCustomers((previous) =>

      previous.includes(customerId)
        ? previous.filter((id) => id !== customerId)
        : [...previous, customerId]

    );

  }

  function toggleAllCustomers() {

    if (
      selectedCustomers.length ===
      filteredCustomers.length
    ) {

      setSelectedCustomers([]);

      return;

    }

    setSelectedCustomers(

      filteredCustomers.map(
        (customer) => customer.id
      )

    );

  }

 async function handleDeleteCustomers() {

    if (selectedCustomers.length === 0) {
        return;
    }

    const confirmed = window.confirm(
        `Delete ${selectedCustomers.length} customer(s)?`
    );

    if (!confirmed) {
        return;
    }

    try {

        await deleteCustomers(selectedCustomers);

        await loadCustomers();

        setSelectedCustomers([]);

        toast.success("Customers deleted.");

    } catch (error) {

        console.error(error);

        toast.error("Failed to delete customers.");

    }

}
  useEffect(() => {

    loadCustomers();

  }, []);


   useEffect(() => {

    setSelectedCustomers([]);

  }, [
    search,
    filter,
    sortField,
    sortDirection,
  ]);

  if (loading) {

    return (

      <div className="space-y-8 p-8">

        <div>

          <h1 className="text-3xl font-bold">

            Customers

          </h1>

          <p className="mt-2 text-gray-500">

            Manage customer relationships.

          </p>

        </div>

        <CustomersTableSkeleton />

      </div>

    );

  }

 

  

  return (

    <div className="space-y-8 p-8">

      <div>

        <h1 className="text-3xl font-bold">

          Customers

        </h1>

        <p className="mt-2 text-gray-500">

          Manage customer relationships.

        </p>

      </div>

      <CustomerStats
        totalCustomers={totalCustomers}
        activeCustomers={activeCustomers}
        totalRevenue={totalRevenue}
        topCustomer={topCustomer}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <CustomerSearch
          value={search}
          onChange={setSearch}
        />

        <CustomerStatusFilter
          value={filter}
          onChange={setFilter}
        />

      </div>

      <div>

 <CustomerBulkActions
  selectedCount={selectedCustomers.length}
  onExport={() => {
    const selected = filteredCustomers.filter(customer =>
      selectedCustomers.includes(customer.id)
    );

    exportCustomersCSV(selected);
  }}
  onEmail={() => {
    const selected = filteredCustomers.filter(customer =>
      selectedCustomers.includes(customer.id)
    );

    emailCustomers(selected);
  }}
  onDelete={handleDeleteCustomers}
/>




       <CustomerTable
  customers={filteredCustomers}
  selectedCustomers={selectedCustomers}
  toggleCustomer={toggleCustomer}
  toggleAllCustomers={toggleAllCustomers}
  sortField={sortField}
  sortDirection={sortDirection}
  setSortField={setSortField}
  setSortDirection={setSortDirection}
  onView={(customer) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  }}
/>


        <CustomerDetailsModal
          open={detailsOpen}
          customer={selectedCustomer}
          onClose={() => setDetailsOpen(false)}
          onUpdated={(updatedCustomer) => {

            setSelectedCustomer(updatedCustomer);

            setCustomers((previous) =>
              previous.map((customer) =>
                customer.id === updatedCustomer.id
                  ? updatedCustomer
                  : customer
              )
            );

          }}
        />
      </div>

    </div>

  );

}