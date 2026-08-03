interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function InventorySearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="w-full md:w-96">
      <input
        type="text"
        placeholder="Search by name, SKU or barcode..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
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
      />
    </div>
  );
}
