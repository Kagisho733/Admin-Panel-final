import { FaPlus } from "react-icons/fa";
export default function AddOrderButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"><FaPlus size={13}/> Add order</button>;
}
