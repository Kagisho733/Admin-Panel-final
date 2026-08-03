import type { SupplierStatus } from "../../types/Supplier";

interface Props {
  status: SupplierStatus;
}

export default function SupplierStatusBadge({
  status,
}: Props) {

  const styles: Record<SupplierStatus, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  const labels: Record<SupplierStatus, string> = {
    active: "Active",
    inactive: "Inactive",
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
