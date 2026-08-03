interface Props {
  onClick: () => void;
}

export default function AddOrderButton({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-lg
        bg-blue-600
        px-5
        py-2.5
        text-white
        transition
        hover:bg-blue-700
      "
    >
      + New Order
    </button>
  );
}
