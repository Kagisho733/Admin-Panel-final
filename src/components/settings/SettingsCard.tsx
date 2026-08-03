interface Props {
  title: string;
  description: string;
  onClick?: () => void;
}

export default function SettingsCard({
  title,
  description,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        rounded-xl
        border
        bg-white
        p-6
        text-left
        shadow-sm
        transition
        hover:shadow-md
        hover:border-blue-500
      "
    >
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-gray-500">
        {description}
      </p>
    </button>
  );
}