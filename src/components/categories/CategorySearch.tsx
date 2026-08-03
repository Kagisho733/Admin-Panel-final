interface Props {

  value: string;

  onChange: (
    value: string
  ) => void;

}

export default function CategorySearch({

  value,

  onChange,

}: Props) {

  return (

    <input
      type="text"
      placeholder="Search categories..."
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="
        w-full
        rounded-xl
        border
        px-4
        py-3
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
      "
    />

  );

}