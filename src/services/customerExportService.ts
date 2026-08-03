import type { Customer } from "../types/Customer";

export function exportCustomersCSV(customers: Customer[]) {
  const headers = [
    "Full Name",
    "Email",
    "Phone",
    "Orders",
    "Total Spent",
  ];

  const rows = customers.map((customer) => [
    customer.fullName,
    customer.email,
    customer.phone ?? "",
    customer.totalOrders,
    customer.totalSpent,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "customers.csv";

  link.click();

  URL.revokeObjectURL(url);
}