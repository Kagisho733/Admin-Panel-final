import { customerTagColors } from "../../data/customerTags";

interface Props {
  tag: string;
  onRemove?: () => void;
}

export default function CustomerTagBadge({
  tag,
  onRemove,
}: Props) {

  const style =
    customerTagColors[tag] ??
    "bg-gray-100 text-gray-800";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${style}
      `}
    >
      {tag}

      {onRemove && (

        <button
          onClick={onRemove}
          className="text-current opacity-60 hover:opacity-100"
        >
          ✕
        </button>

      )}
    </span>
  );
}
