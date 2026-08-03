import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { Expense } from "../../types/Finance";

import type { Order } from "../../types/Order";

import type { Supplier } from "../../types/Supplier";

import type { PurchaseOrder } from "../../types/PurchaseOrder";

import {
  getExpenses,
  deleteExpense,
  calculateFinanceSummary,
  buildMonthlyFinancePoints,
  groupExpensesByCategory,
  exportExpensesCSV,
} from "../../services/financeService";

import { getOrders } from "../../services/orderService";

import { getSuppliers } from "../../services/supplierService";

import {
  getPurchaseOrders,
} from "../../services/purchaseOrderService";

import FinanceStats
from "../../components/finance/FinanceStats";

import ProfitLossChart
from "../../components/finance/ProfitLossChart";

import ExpenseCategoryChart
from "../../components/finance/ExpenseCategoryChart";

import ExpensesTable
from "../../components/finance/ExpensesTable";

import ExpenseFormModal
from "../../components/finance/ExpenseFormModal";

import ConfirmModal
from "../../components/common/ConfirmModal";

import { expenseCategories }
from "../../data/expenseCategories";

import { useAuth } from "../../hooks/useAuth";

export default function FinancePage() {

  const { user } = useAuth();

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>([]);

  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [selectedExpense, setSelectedExpense] =
    useState<Expense | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  async function loadData() {

    try {

      const [
        expenseData,
        orderData,
        purchaseData,
        supplierData,
      ] = await Promise.all([
        getExpenses(),
        getOrders(),
        getPurchaseOrders(),
        getSuppliers(),
      ]);

      setExpenses(expenseData);

      setOrders(orderData);

      setPurchaseOrders(purchaseData);

      setSuppliers(supplierData);

    } catch (error) {

      console.error(
        "Error loading finance data:",
        error
      );

      toast.error("Failed to load finance data.");

    } finally {

      setLoading(false);

    }

  }

  async function handleDelete() {

    if (!selectedExpense?.id) {

      return;

    }

    try {

      await deleteExpense(
        selectedExpense.id,
        selectedExpense.description,
        user?.email ?? "Unknown"
      );

      await loadData();

      toast.success("Expense deleted.");

    } catch (error) {

      console.error(
        "Failed to delete expense:",
        error
      );

      toast.error("Failed to delete expense.");

    } finally {

      setConfirmOpen(false);

    }

  }

  useEffect(() => {

    loadData();

  }, []);

  const summary = calculateFinanceSummary(
    orders,
    expenses,
    purchaseOrders
  );

  const monthlyPoints = buildMonthlyFinancePoints(
    orders,
    expenses
  );

  const categoryTotals =
    groupExpensesByCategory(expenses);

  const filteredExpenses = expenses.filter((expense) => {

    const term = search.toLowerCase();

    const matchesSearch =
      expense.description
        .toLowerCase()
        .includes(term) ||

      (expense.reference ?? "")
        .toLowerCase()
        .includes(term);

    const matchesCategory =
      categoryFilter === ""
        ? true
        : expense.category === categoryFilter;

    return matchesSearch && matchesCategory;

  });

  if (loading) {

    return (

      <div className="p-8">

        Loading finance data...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Finance

          </h1>

          <p className="mt-2 text-gray-500">

            Track expenses, profit and business performance.

          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={() =>
              exportExpensesCSV(filteredExpenses)
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
              setSelectedExpense(null);
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
            + Capture Expense
          </button>

        </div>

      </div>

      <FinanceStats summary={summary} />

      <div className="grid gap-6 xl:grid-cols-2">

        <ProfitLossChart data={monthlyPoints} />

        <ExpenseCategoryChart data={categoryTotals} />

      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="w-full md:w-96">

          <input
            type="text"
            placeholder="Search expenses..."
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

        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
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

          <option value="">All Categories</option>

          {expenseCategories.map((category) => (

            <option
              key={category}
              value={category}
            >
              {category}
            </option>

          ))}

        </select>

      </div>

      <ExpensesTable
        expenses={filteredExpenses}
        onEdit={(expense) => {
          setSelectedExpense(expense);
          setFormOpen(true);
        }}
        onDelete={(expense) => {
          setSelectedExpense(expense);
          setConfirmOpen(true);
        }}
      />

      <ExpenseFormModal
        open={formOpen}
        expense={selectedExpense}
        suppliers={suppliers}
        onClose={() => setFormOpen(false)}
        onSaved={loadData}
      />

      <ConfirmModal
        open={confirmOpen}
        title="Delete Expense"
        message={`Are you sure you want to delete ${selectedExpense?.description ?? "this expense"}?`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>

  );

}
