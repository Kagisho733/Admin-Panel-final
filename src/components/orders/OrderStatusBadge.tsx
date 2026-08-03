import type { OrderStatus } from "../../types/Order";

interface Props {
  status: OrderStatus;
}

export default function OrderStatusBadge({
  status,
}: Props) {

  const styles: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const labels: Record<OrderStatus, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
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