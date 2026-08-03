import type { Order } from "../types/Order";

export function exportOrdersToCSV(
  orders: Order[],
filename = `orders-${new Date()
  .toISOString()
  .slice(0, 10)}.csv`
) {
  const headers = [
    "Order ID",
    "Customer",
    "Email",
    "Status",
    "Total",
    "Date",
  ];

  const rows = orders.map((order) => [
    escapeCSV(order.id ?? ""),
  escapeCSV(order.customerName),
  escapeCSV(order.customerEmail),
  escapeCSV(order.status),
  order.totalAmount.toFixed(2),
  escapeCSV(formatDate(order.createdAt)),
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

function formatDate(createdAt: any) {
  if (!createdAt) return "";

  if (typeof createdAt.toDate === "function") {
    return createdAt
      .toDate()
      .toLocaleDateString();
  }

  return new Date(createdAt)
    .toLocaleDateString();
}

function escapeCSV(value: string) {
  return `"${String(value).replace(/"/g, '""')}"`;
}