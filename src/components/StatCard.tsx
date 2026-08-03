import { FaArrowUp } from "react-icons/fa";
import type { IconType } from "react-icons";

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    color: string;
    icon: IconType;
}

export default function StatCard({
  title,
  value,
  change,
  color,
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`${color} w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl`}
        >

         <Icon size={24} />

        </div>

      </div>

      <div className="flex items-center gap-2 mt-5">

        <FaArrowUp className="text-green-500" />

        <span className="text-green-600 font-semibold">
          {change}
        </span>

        <span className="text-gray-500">
          vs last month
        </span>

      </div>

    </div>
  );
}