/*
|--------------------------------------------------------------------------
| Inventory Export Service
|--------------------------------------------------------------------------
| Exports the current stock position to CSV.
|--------------------------------------------------------------------------
*/

import type { Product } from "../types/Product";

import { getStockStatus } from "./inventoryService";

export function exportInventoryCSV(
  products: Product[],
  filename = `inventory-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`
) {

  const headers = [
    "Product",
    "SKU",
    "Category",
    "Stock",
    "Minimum",
    "Cost Price",
    "Stock Value",
    "Status",
  ];

  const rows = products.map((product) => [
    escapeCSV(product.name),
    escapeCSV(product.sku ?? ""),
    escapeCSV(product.category ?? ""),
    product.stock ?? 0,
    product.minStock ?? 0,
    (product.costPrice ?? 0).toFixed(2),
    (
      (product.stock ?? 0) *
      (product.costPrice ?? 0)
    ).toFixed(2),
    escapeCSV(getStockStatus(product)),
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
