import { FaSearch } from "react-icons/fa";

interface Props {

  value: string;

  onChange: (value: string) => void;

}

export default function ProductSearch({

  value,

  onChange,

}: Props) {

return (

  <div className="relative w-full md:w-96">

    <FaSearch
      className="
        absolute
        left-4
        top-1/2
        -translate-y-1/2
        text-gray-400
      "
    />

    <input
      type="text"
      placeholder="Search by product name or SKU..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        py-3
        pl-11
        pr-4
        shadow-sm
        transition
        focus:border-blue-500
        focus:outline-none
        focus:ring-2
        focus:ring-blue-200
      "
    />

  </div>

);

}