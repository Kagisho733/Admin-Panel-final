import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import type { Order } from "../../types/Order";

import type { Product } from "../../types/Product";

import type { PurchaseOrder } from "../../types/PurchaseOrder";

import type { Expense } from "../../types/Finance";

import type { DateRange, ReportType } from "../../types/Report";

import {
  getDefaultDateRange,
  buildSalesReport,
  buildReportTotals,
  buildTopProducts,
  buildInventoryReport,
  buildPurchasingReport,
  buildFinanceReport,
  exportReportCSV,
} from "../../services/reportService";

import { getOrders } from "../../services/orderService";

import { getProducts } from "../../services/productService";

import { getPurchaseOrders }
from "../../services/purchaseOrderService";

import { getExpenses } from "../../services/financeService";

import { getInventoryValue }
from "../../services/inventoryService";

import ReportDateRange
from "../../components/reports/ReportDateRange";

import ReportSummaryCards
from "../../components/reports/ReportSummaryCards";

import ReportTable
from "../../components/reports/ReportTable";

import SalesTrendChart
from "../../components/reports/SalesTrendChart";

import { formatCurrency } from "../../utils/formatCurrency";

const reportTabs: { value: ReportType; label: string }[] = [
  { value: "sales", label: "Sales" },
  { value: "inventory", label: "Inventory" },
  { value: "purchasing", label: "Purchasing" },
  { value: "finance", label: "Finance" },
];

export default function ReportsPage() {

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>([]);

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [reportType, setReportType] =
    useState<ReportType>("sales");

  const [range, setRange] =
    useState<DateRange>(getDefaultDateRange());

  async function loadData() {

    try {

      const [
        orderData,
        productData,
        purchaseData,
        expenseData,
      ] = await Promise.all([
        getOrders(),
        getProducts(),
        getPurchaseOrders(),
        getExpenses(),
      ]);

      setOrders(orderData);

      setProducts(productData);

      setPurchaseOrders(purchaseData);

      setExpenses(expenseData);

    } catch (error) {

      console.error(
        "Error loading report data:",
        error
      );

      toast.error("Failed to load report data.");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadData();

  }, []);

  const salesRows = buildSalesReport(orders, range);

  const totals = buildReportTotals(orders, range);

  const topProducts = buildTopProducts(orders, range);

  const inventoryRows = buildInventoryReport(products);

  const purchasingRows = buildPurchasingReport(
    purchaseOrders,
    range
  );

  const financeRows = buildFinanceReport(expenses, range);

  function handleExport() {

    if (reportType === "sales") {

      exportReportCSV(
        ["Date", "Orders", "Revenue"],
        salesRows.map((row) => [
          row.period,
          row.orders,
          row.revenue.toFixed(2),
        ]),
        `sales-report-${range.from}-to-${range.to}.csv`
      );

    }

    if (reportType === "inventory") {

      exportReportCSV(
        [
          "Product",
          "SKU",
          "Category",
          "Stock",
          "Minimum",
          "Stock Value",
          "Status",
        ],
        inventoryRows.map((row) => [
          row.name,
          row.sku,
          row.category,
          row.stock,
          row.minStock,
          row.stockValue.toFixed(2),
          row.status,
        ]),
        `inventory-report-${range.to}.csv`
      );

    }

    if (reportType === "purchasing") {

      exportReportCSV(
        ["Supplier", "Purchase Orders", "Value"],
        purchasingRows.map((row) => [
          row.supplier,
          row.orders,
          row.value.toFixed(2),
        ]),
        `purchasing-report-${range.from}-to-${range.to}.csv`
      );

    }

    if (reportType === "finance") {

      exportReportCSV(
        ["Category", "Entries", "Amount"],
        financeRows.map((row) => [
          row.category,
          row.count,
          row.amount.toFixed(2),
        ]),
        `finance-report-${range.from}-to-${range.to}.csv`
      );

    }

    toast.success("Report exported.");

  }

  if (loading) {

    return (

      <div className="p-8">

        Loading reports...

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Reports

          </h1>

          <p className="mt-2 text-gray-500">

            Analyse sales, stock, purchasing and expenses.

          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={handleExport}
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
            onClick={() => window.print()}
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
            Print
          </button>

        </div>

      </div>

      <div className="flex flex-wrap gap-2">

        {reportTabs.map((tab) => (

          <button
            key={tab.value}
            onClick={() => setReportType(tab.value)}
            className={`
              rounded-xl
              px-5
              py-2.5
              font-medium
              transition

              ${reportType === tab.value
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-slate-100"
              }
            `}
          >
            {tab.label}
          </button>

        ))}

      </div>

      {reportType !== "inventory" && (

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

          <ReportDateRange
            range={range}
            onChange={setRange}
          />

        </div>

      )}

      {reportType === "sales" && (

        <>

          <ReportSummaryCards
            items={[
              {
                label: "Orders",
                value: String(totals.orders),
              },
              {
                label: "Revenue",
                value: formatCurrency(totals.revenue),
                color: "text-green-600",
              },
              {
                label: "Average Order Value",
                value: formatCurrency(
                  totals.averageOrderValue
                ),
              },
              {
                label: "Products Sold",
                value: String(
                  topProducts.reduce(
                    (sum, row) => sum + row.quantity,
                    0
                  )
                ),
              },
            ]}
          />

          <SalesTrendChart data={salesRows} />

          <div>

            <h2 className="mb-4 text-xl font-semibold">
              Sales By Day
            </h2>

            <ReportTable
              headers={["Date", "Orders", "Revenue"]}
              rows={salesRows.map((row) => [
                row.period,
                row.orders,
                formatCurrency(row.revenue),
              ])}
            />

          </div>

          <div>

            <h2 className="mb-4 text-xl font-semibold">
              Top Products
            </h2>

            <ReportTable
              headers={["Product", "Quantity", "Revenue"]}
              rows={topProducts.map((row) => [
                row.name,
                row.quantity,
                formatCurrency(row.revenue),
              ])}
            />

          </div>

        </>

      )}

      {reportType === "inventory" && (

        <>

          <ReportSummaryCards
            items={[
              {
                label: "Products",
                value: String(products.length),
              },
              {
                label: "Stock Value",
                value: formatCurrency(
                  getInventoryValue(products)
                ),
                color: "text-green-600",
              },
              {
                label: "Low Stock",
                value: String(
                  inventoryRows.filter(
                    (row) => row.status === "low-stock"
                  ).length
                ),
                color: "text-yellow-600",
              },
              {
                label: "Out Of Stock",
                value: String(
                  inventoryRows.filter(
                    (row) => row.status === "out-of-stock"
                  ).length
                ),
                color: "text-red-600",
              },
            ]}
          />

          <ReportTable
            headers={[
              "Product",
              "SKU",
              "Category",
              "Stock",
              "Minimum",
              "Stock Value",
              "Status",
            ]}
            rows={inventoryRows.map((row) => [
              row.name,
              row.sku || "-",
              row.category || "-",
              row.stock,
              row.minStock,
              formatCurrency(row.stockValue),
              row.status,
            ])}
          />

        </>

      )}

      {reportType === "purchasing" && (

        <>

          <ReportSummaryCards
            items={[
              {
                label: "Suppliers Used",
                value: String(purchasingRows.length),
              },
              {
                label: "Purchase Orders",
                value: String(
                  purchasingRows.reduce(
                    (sum, row) => sum + row.orders,
                    0
                  )
                ),
              },
              {
                label: "Purchase Value",
                value: formatCurrency(
                  purchasingRows.reduce(
                    (sum, row) => sum + row.value,
                    0
                  )
                ),
                color: "text-green-600",
              },
              {
                label: "Period",
                value: `${range.from} → ${range.to}`,
              },
            ]}
          />

          <ReportTable
            headers={["Supplier", "Purchase Orders", "Value"]}
            rows={purchasingRows.map((row) => [
              row.supplier,
              row.orders,
              formatCurrency(row.value),
            ])}
          />

        </>

      )}

      {reportType === "finance" && (

        <>

          <ReportSummaryCards
            items={[
              {
                label: "Expense Categories",
                value: String(financeRows.length),
              },
              {
                label: "Entries",
                value: String(
                  financeRows.reduce(
                    (sum, row) => sum + row.count,
                    0
                  )
                ),
              },
              {
                label: "Total Expenses",
                value: formatCurrency(
                  financeRows.reduce(
                    (sum, row) => sum + row.amount,
                    0
                  )
                ),
                color: "text-red-600",
              },
              {
                label: "Revenue In Period",
                value: formatCurrency(totals.revenue),
                color: "text-green-600",
              },
            ]}
          />

          <ReportTable
            headers={["Category", "Entries", "Amount"]}
            rows={financeRows.map((row) => [
              row.category,
              row.count,
              formatCurrency(row.amount),
            ])}
          />

        </>

      )}

    </div>

  );

}
