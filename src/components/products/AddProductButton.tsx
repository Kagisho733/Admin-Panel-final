interface Props {

  onClick: () => void;

}

export default function AddProductButton({

  onClick,

}: Props) {

  return (

    <button

      onClick={onClick}

      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"

    >

      + Add Product

    </button>

  );

}