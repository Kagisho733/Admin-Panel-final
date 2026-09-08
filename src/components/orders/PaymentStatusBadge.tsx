import type { PaymentStatus } from "../../types/Order";

interface Props {
  status?: PaymentStatus;
}

export default function PaymentStatusBadge({
  status = "unpaid",
}: Props) {

  const styles: Record<PaymentStatus, string> = {
    "unpaid": "bg-red-100 text-red-800",
    "partially-paid": "bg-yellow-100 text-yellow-800",
    "partially_refunded": "bg-amber-100 text-amber-800",
    "paid": "bg-green-100 text-green-800",
    "refunded": "bg-slate-100 text-slate-800",
  };

  const labels: Record<PaymentStatus, string> = {
    "unpaid": "Unpaid",
    "partially-paid": "Partially Paid",
    "partially_refunded": "Partially Refunded",
    "paid": "Paid",
    "refunded": "Refunded",
  };

  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-3
        py-1
        text-sm
        font-semibold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}
