import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";

interface Props {

  value: string;

  onChange: (value: string) => void;

}

export default function CategoryFilter({

  value,

  onChange,

}: Props) {

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    void getCategories()
      .then((items) => setCategories(items.map((item) => item.name)))
      .catch(() => setCategories([]));
  }, []);

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

      {categories.map((category) => (

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
