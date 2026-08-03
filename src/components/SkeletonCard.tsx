export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow p-6 animate-pulse">

      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>

      <div className="h-8 bg-gray-300 rounded w-2/3"></div>

      <div className="h-4 bg-gray-300 rounded w-1/3 mt-4"></div>

    </div>
  );
}