import type { OrderStatus } from "../../types/Order";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const statuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderStatusFilter({
  value,
  onChange,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        rounded-xl
        border
        px-4
        py-3
      "
    >
      <option value="">
        All Statuses
      </option>

      {statuses.map((status) => (
        <option
          key={status}
          value={status}
        >
          {status}
        </option>
      ))}
    </select>
  );
}