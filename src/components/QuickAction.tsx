import { useNavigate } from "react-router-dom";
import type { IconType } from "react-icons";

interface Props {
  title: string;
  description: string;
  icon: IconType;
  route: string;
}

export default function QuickAction({
  title,
  description,
  icon: Icon,
  route,
}: Props) {

  const navigate = useNavigate();

  return (

    <button
      onClick={() => navigate(route)}
      className="
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
        p-6
        text-left
        border
        border-gray-100
        w-full
      "
    >

      <div className="flex items-center gap-4">

        <div className="bg-blue-100 text-blue-600 rounded-xl p-4">

          <Icon size={24} />

        </div>

        <div>

          <h3 className="font-bold text-lg">

            {title}

          </h3>

          <p className="text-gray-500 mt-1">

            {description}

          </p>

        </div>

      </div>

    </button>

  );
}