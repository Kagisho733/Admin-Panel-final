import type { StockStatus } from "../../types/Inventory";

interface Props {
  status: StockStatus;
}

export default function StockStatusBadge({
  status,
}: Props) {

  const styles: Record<StockStatus, string> = {
    "in-stock": "bg-green-100 text-green-800",
    "low-stock": "bg-yellow-100 text-yellow-800",
    "out-of-stock": "bg-red-100 text-red-800",
  };

  const labels: Record<StockStatus, string> = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out Of Stock",
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
