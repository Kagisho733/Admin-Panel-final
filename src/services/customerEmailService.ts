import type { Customer } from "../types/Customer";

export function emailCustomers(customers: Customer[]) {
  if (customers.length === 0) return;

  const emails = customers
    .map(customer => customer.email)
    .filter(Boolean)
    .join(";");

  window.location.href =
    `mailto:${emails}?subject=Books & Bots&body=Dear Customer,`;
}