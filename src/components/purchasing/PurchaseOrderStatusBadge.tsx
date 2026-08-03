import type { PurchaseOrderStatus }
from "../../types/PurchaseOrder";

interface Props {
  status: PurchaseOrderStatus;
}

export default function PurchaseOrderStatusBadge({
  status,
}: Props) {

  const styles: Record<PurchaseOrderStatus, string> = {
    "draft": "bg-gray-100 text-gray-800",
    "ordered": "bg-blue-100 text-blue-800",
    "partially-received": "bg-yellow-100 text-yellow-800",
    "received": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800",
  };

  const labels: Record<PurchaseOrderStatus, string> = {
    "draft": "Draft",
    "ordered": "Ordered",
    "partially-received": "Partially Received",
    "received": "Received",
    "cancelled": "Cancelled",
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
