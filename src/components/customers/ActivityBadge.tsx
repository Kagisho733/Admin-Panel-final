import type { CustomerActivity }
from "../../types/CustomerActivity";

interface Props {
  type: CustomerActivity["type"];
}

const styles: Record<CustomerActivity["type"], string> = {
  note: "bg-amber-100 text-amber-800",
  order: "bg-blue-100 text-blue-800",
  email: "bg-purple-100 text-purple-800",
  invoice: "bg-emerald-100 text-emerald-800",
  customer: "bg-slate-100 text-slate-800",
  status: "bg-green-100 text-green-800",
};

const labels: Record<CustomerActivity["type"], string> = {
  note: "Note",
  order: "Order",
  email: "Email",
  invoice: "Invoice",
  customer: "Customer",
  status: "Status",
};

export default function ActivityBadge({
  type,
}: Props) {

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[type]}
      `}
    >
      {labels[type]}
    </span>
  );
}
