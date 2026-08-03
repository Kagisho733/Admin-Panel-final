/*
|--------------------------------------------------------------------------
| Finance Service
|--------------------------------------------------------------------------
| Expense tracking plus the profit and loss figures that combine sales
| revenue, purchase costs and operating expenses.
|--------------------------------------------------------------------------
*/

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type {
  Expense,
  FinanceSummary,
  MonthlyFinancePoint,
} from "../types/Finance";

import type { Order } from "../types/Order";

import type { PurchaseOrder } from "../types/PurchaseOrder";

import { logAudit } from "./auditLogService";

const expensesCollection = collection(db, "expenses");

/*
|--------------------------------------------------------------------------
| Get Expenses
|--------------------------------------------------------------------------
*/

export async function getExpenses(): Promise<Expense[]> {

  const q = query(
    expensesCollection,
    orderBy("date", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Expense, "id">),
  }));

}

/*
|--------------------------------------------------------------------------
| Create Expense
|--------------------------------------------------------------------------
*/

export async function createExpense(
  expense: Expense
): Promise<string> {

  const created = await addDoc(expensesCollection, {

    ...expense,

    createdAt: new Date(),

    updatedAt: new Date(),

  });

  await logAudit({

    action: "create",

    module: "finance",

    entityId: created.id,

    entityName: expense.description,

    description:
      `Expense "${expense.description}" was captured.`,

    performedBy: expense.createdBy,

  });

  return created.id;

}

/*
|--------------------------------------------------------------------------
| Update Expense
|--------------------------------------------------------------------------
*/

export async function updateExpense(
  expenseId: string,
  expense: Partial<Expense>,
  performedBy: string
): Promise<void> {

  await updateDoc(
    doc(db, "expenses", expenseId),
    {
      ...expense,
      updatedAt: new Date(),
    }
  );

  await logAudit({

    action: "update",

    module: "finance",

    entityId: expenseId,

    entityName: expense.description ?? "",

    description: `Expense was updated.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Delete Expense
|--------------------------------------------------------------------------
*/

export async function deleteExpense(
  expenseId: string,
  description: string,
  performedBy: string
): Promise<void> {

  await deleteDoc(
    doc(db, "expenses", expenseId)
  );

  await logAudit({

    action: "delete",

    module: "finance",

    entityId: expenseId,

    entityName: description,

    description: `Expense "${description}" was deleted.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| To Date
|--------------------------------------------------------------------------
| Firestore timestamps, ISO strings and Date objects all become a Date.
|--------------------------------------------------------------------------
*/

export function toDate(value: any): Date | null {

  if (!value) {

    return null;

  }

  if (typeof value.toDate === "function") {

    return value.toDate();

  }

  const parsed = new Date(value);

  return isNaN(parsed.getTime())
    ? null
    : parsed;

}

/*
|--------------------------------------------------------------------------
| Calculate Finance Summary
|--------------------------------------------------------------------------
*/

export function calculateFinanceSummary(
  orders: Order[],
  expenses: Expense[],
  purchaseOrders: PurchaseOrder[]
): FinanceSummary {

  const revenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce(
      (sum, order) => sum + (order.totalAmount ?? 0),
      0
    );

  const expenseTotal = expenses.reduce(
    (sum, expense) => sum + (expense.amount ?? 0),
    0
  );

  const purchases = purchaseOrders
    .filter(
      (purchaseOrder) =>
        purchaseOrder.status === "received" ||
        purchaseOrder.status === "partially-received"
    )
    .reduce(
      (sum, purchaseOrder) =>
        sum + (purchaseOrder.totalAmount ?? 0),
      0
    );

  const grossProfit = revenue - purchases;

  const netProfit = grossProfit - expenseTotal;

  const margin =
    revenue === 0
      ? 0
      : (netProfit / revenue) * 100;

  return {

    revenue,

    expenses: expenseTotal,

    purchases,

    grossProfit,

    netProfit,

    margin,

  };

}

/*
|--------------------------------------------------------------------------
| Build Monthly Finance Points
|--------------------------------------------------------------------------
| Returns the last twelve months of revenue, expenses and profit.
|--------------------------------------------------------------------------
*/

export function buildMonthlyFinancePoints(
  orders: Order[],
  expenses: Expense[]
): MonthlyFinancePoint[] {

  const points: MonthlyFinancePoint[] = [];

  const now = new Date();

  for (let index = 11; index >= 0; index--) {

    const date = new Date(
      now.getFullYear(),
      now.getMonth() - index,
      1
    );

    const key =
      `${date.getFullYear()}-${date.getMonth()}`;

    const label = date.toLocaleDateString("en-ZA", {
      month: "short",
    });

    const monthRevenue = orders
      .filter((order) => {

        const orderDate = toDate(order.createdAt);

        if (!orderDate || order.status === "cancelled") {

          return false;

        }

        return (
          `${orderDate.getFullYear()}-${orderDate.getMonth()}` === key
        );

      })
      .reduce(
        (sum, order) => sum + (order.totalAmount ?? 0),
        0
      );

    const monthExpenses = expenses
      .filter((expense) => {

        const expenseDate = toDate(expense.date);

        if (!expenseDate) {

          return false;

        }

        return (
          `${expenseDate.getFullYear()}-${expenseDate.getMonth()}` === key
        );

      })
      .reduce(
        (sum, expense) => sum + (expense.amount ?? 0),
        0
      );

    points.push({

      month: label,

      revenue: monthRevenue,

      expenses: monthExpenses,

      profit: monthRevenue - monthExpenses,

    });

  }

  return points;

}

/*
|--------------------------------------------------------------------------
| Group Expenses By Category
|--------------------------------------------------------------------------
*/

export function groupExpensesByCategory(
  expenses: Expense[]
) {

  const totals: Record<string, number> = {};

  expenses.forEach((expense) => {

    const category = expense.category || "Other";

    totals[category] =
      (totals[category] ?? 0) + (expense.amount ?? 0);

  });

  return Object.entries(totals).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

}

/*
|--------------------------------------------------------------------------
| Export Expenses CSV
|--------------------------------------------------------------------------
*/

export function exportExpensesCSV(
  expenses: Expense[],
  filename = `expenses-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`
) {

  const headers = [
    "Date",
    "Description",
    "Category",
    "Payment Method",
    "Reference",
    "VAT",
    "Amount",
  ];

  const rows = expenses.map((expense) => [
    escapeCSV(expense.date),
    escapeCSV(expense.description),
    escapeCSV(expense.category),
    escapeCSV(expense.paymentMethod),
    escapeCSV(expense.reference ?? ""),
    (expense.vatAmount ?? 0).toFixed(2),
    (expense.amount ?? 0).toFixed(2),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

}

function escapeCSV(value: string) {
  return `"${String(value).replace(/"/g, '""')}"`;
}
