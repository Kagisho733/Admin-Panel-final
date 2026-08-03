interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function PurchaseSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="w-full md:w-96">
      <input
        type="text"
        placeholder="Search by PO number or supplier..."
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
