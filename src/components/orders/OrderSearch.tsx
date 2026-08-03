interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function OrderSearch({
  value,
  onChange,
}: Props) {
  return (
    <input
      type="text"
      placeholder="Search orders..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        md:w-80
        rounded-xl
        border
        px-4
        py-3
      "
    />
  );
}