interface Props {
  rows?: number;
}

export default function CustomersTableSkeleton({
  rows = 8,
}: Props) {

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="animate-pulse">

        <div className="flex gap-6 bg-gray-100 px-6 py-5">

          <div className="h-4 w-6 rounded bg-gray-200" />

          <div className="h-4 flex-1 rounded bg-gray-200" />

          <div className="h-4 flex-1 rounded bg-gray-200" />

          <div className="h-4 w-24 rounded bg-gray-200" />

          <div className="h-4 w-24 rounded bg-gray-200" />

        </div>

        {Array.from({ length: rows }).map((_, index) => (

          <div
            key={index}
            className="flex items-center gap-6 border-t px-6 py-5"
          >

            <div className="h-4 w-6 rounded bg-gray-100" />

            <div className="h-4 flex-1 rounded bg-gray-100" />

            <div className="h-4 flex-1 rounded bg-gray-100" />

            <div className="h-4 w-24 rounded bg-gray-100" />

            <div className="h-4 w-24 rounded bg-gray-100" />

          </div>

        ))}

      </div>

    </div>
  );
}
