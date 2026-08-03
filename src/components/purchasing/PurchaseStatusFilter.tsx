interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PurchaseStatusFilter({
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
        border-gray-300
        bg-white
        px-4
        py-3
        shadow-sm
        outline-none
        transition
        focus:border-blue-500
        focus:ring-2
        focus:ring-blue-200
      "
    >
      <option value="">All Orders</option>
      <option value="draft">Draft</option>
      <option value="ordered">Ordered</option>
      <option value="partially-received">Partially Received</option>
      <option value="received">Received</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
