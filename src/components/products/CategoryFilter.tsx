import { productCategories } from "../../data/productCategories";

interface Props {

  value: string;

  onChange: (value: string) => void;

}

export default function CategoryFilter({

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
  transition
  focus:border-blue-500
  focus:outline-none
  focus:ring-2
  focus:ring-blue-200
"

    >

      <option value="">

        All Categories

      </option>

      {productCategories.map((category) => (

        <option
          key={category}
          value={category}
        >

          {category}

        </option>

      ))}

    </select>

  );

}