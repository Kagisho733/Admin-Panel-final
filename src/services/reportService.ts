/*
|--------------------------------------------------------------------------
| Report Service
|--------------------------------------------------------------------------
| Builds the reporting datasets from the data already stored by the other
| modules. No new collections are created here.
|--------------------------------------------------------------------------
*/

import type { Order } from "../types/Order";

import type { Product } from "../types/Product";

import type { PurchaseOrder } from "../types/PurchaseOrder";

import type { Expense } from "../types/Finance";

import type {
  DateRange,
  SalesReportRow,
  TopProductRow,
  ReportTotals,
} from "../types/Report";

import { toDate } from "./financeService";

import { getStockStatus } from "./inventoryService";

/*
|--------------------------------------------------------------------------
| Get Default Date Range
|--------------------------------------------------------------------------
| Defaults to the last thirty days.
|--------------------------------------------------------------------------
*/

export function getDefaultDateRange(): DateRange {

  const to = new Date();

  const from = new Date();

  from.setDate(from.getDate() - 30);

  return {

    from: from.toISOString().slice(0, 10),

    to: to.toISOString().slice(0, 10),

  };

}

/*
|--------------------------------------------------------------------------
| Is Within Range
|--------------------------------------------------------------------------
*/

export function isWithinRange(
  value: any,
  range: DateRange
): boolean {

  const date = toDate(value);

  if (!date) {

    return false;

  }

  const from = new Date(`${range.from}T00:00:00`);

  const to = new Date(`${range.to}T23:59:59`);

  return date >= from && date <= to;

}

/*
|--------------------------------------------------------------------------
| Filter Orders By Range
|--------------------------------------------------------------------------
*/

export function filterOrdersByRange(
  orders: Order[],
  range: DateRange
): Order[] {

  return orders.filter(
    (order) =>
      order.status !== "cancelled" &&
      isWithinRange(order.createdAt, range)
  );

}

/*
|--------------------------------------------------------------------------
| Build Sales Report
|--------------------------------------------------------------------------
| Groups the orders in range by day.
|--------------------------------------------------------------------------
*/

export function buildSalesReport(
  orders: Order[],
  range: DateRange
): SalesReportRow[] {

  const inRange = filterOrdersByRange(orders, range);

  const grouped: Record<string, SalesReportRow> = {};

  inRange.forEach((order) => {

    const date = toDate(order.createdAt);

    if (!date) {

      return;

    }

    const key = date.toISOString().slice(0, 10);

    if (!grouped[key]) {

      grouped[key] = {
        period: key,
        orders: 0,
        revenue: 0,
      };

    }

    grouped[key].orders += 1;

    grouped[key].revenue += order.totalAmount ?? 0;

  });

  return Object.values(grouped).sort(
    (a, b) => a.period.localeCompare(b.period)
  );

}

/*
|--------------------------------------------------------------------------
| Build Report Totals
|--------------------------------------------------------------------------
*/

export function buildReportTotals(
  orders: Order[],
  range: DateRange
): ReportTotals {

  const inRange = filterOrdersByRange(orders, range);

  const revenue = inRange.reduce(
    (sum, order) => sum + (order.totalAmount ?? 0),
    0
  );

  return {

    orders: inRange.length,

    revenue,

    averageOrderValue:
      inRange.length === 0
        ? 0
        : revenue / inRange.length,

  };

}

/*
|--------------------------------------------------------------------------
| Build Top Products
|--------------------------------------------------------------------------
*/

export function buildTopProducts(
  orders: Order[],
  range: DateRange,
  max = 10
): TopProductRow[] {

  const inRange = filterOrdersByRange(orders, range);

  const grouped: Record<string, TopProductRow> = {};

  inRange.forEach((order) => {

    (order.items ?? []).forEach((item) => {

      const key = item.name;

      if (!grouped[key]) {

        grouped[key] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
        };

      }

      grouped[key].quantity += item.quantity ?? 0;

      grouped[key].revenue +=
        (item.quantity ?? 0) * (item.price ?? 0);

    });

  });

  return Object.values(grouped)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, max);

}

/*
|--------------------------------------------------------------------------
| Build Inventory Report
|--------------------------------------------------------------------------
*/

export function buildInventoryReport(
  products: Product[]
) {

  return products
    .map((product) => ({

      name: product.name,

      sku: product.sku ?? "",

      category: product.category ?? "",

      stock: product.stock ?? 0,

      minStock: product.minStock ?? 0,

      stockValue:
        (product.stock ?? 0) *
        (product.costPrice ?? 0),

      status: getStockStatus(product),

    }))
    .sort((a, b) => b.stockValue - a.stockValue);

}

/*
|--------------------------------------------------------------------------
| Build Purchasing Report
|--------------------------------------------------------------------------
*/

export function buildPurchasingReport(
  purchaseOrders: PurchaseOrder[],
  range: DateRange
) {

  const inRange = purchaseOrders.filter(
    (purchaseOrder) =>
      purchaseOrder.status !== "cancelled" &&
      isWithinRange(purchaseOrder.createdAt, range)
  );

  const grouped: Record<string, {
    supplier: string;
    orders: number;
    value: number;
  }> = {};

  inRange.forEach((purchaseOrder) => {

    const key =
      purchaseOrder.supplierName || "Unknown";

    if (!grouped[key]) {

      grouped[key] = {
        supplier: key,
        orders: 0,
        value: 0,
      };

    }

    grouped[key].orders += 1;

    grouped[key].value +=
      purchaseOrder.totalAmount ?? 0;

  });

  return Object.values(grouped).sort(
    (a, b) => b.value - a.value
  );

}

/*
|--------------------------------------------------------------------------
| Build Finance Report
|--------------------------------------------------------------------------
*/

export function buildFinanceReport(
  expenses: Expense[],
  range: DateRange
) {

  const inRange = expenses.filter(
    (expense) => isWithinRange(expense.date, range)
  );

  const grouped: Record<string, {
    category: string;
    count: number;
    amount: number;
  }> = {};

  inRange.forEach((expense) => {

    const key = expense.category || "Other";

    if (!grouped[key]) {

      grouped[key] = {
        category: key,
        count: 0,
        amount: 0,
      };

    }

    grouped[key].count += 1;

    grouped[key].amount += expense.amount ?? 0;

  });

  return Object.values(grouped).sort(
    (a, b) => b.amount - a.amount
  );

}

/*
|--------------------------------------------------------------------------
| Export Report CSV
|--------------------------------------------------------------------------
| Generic exporter used by every report tab.
|--------------------------------------------------------------------------
*/

export function exportReportCSV(
  headers: string[],
  rows: (string | number)[][],
  filename: string
) {

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((value) =>
          typeof value === "number"
            ? value
            : escapeCSV(String(value))
        )
        .join(",")
    ),
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
