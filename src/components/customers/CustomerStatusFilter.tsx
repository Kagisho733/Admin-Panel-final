interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerStatusFilter({
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
      <option value="">All Customers</option>
      <option value="active">Active Customers</option>
      <option value="new">New Customers</option>
    </select>
  );
}