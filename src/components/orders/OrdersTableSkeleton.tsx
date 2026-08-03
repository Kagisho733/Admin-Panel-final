export default function OrdersTableSkeleton() {

  return (

    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="animate-pulse">

        {/* Header */}

        <div className="border-b bg-slate-100 p-5">

          <div className="h-6 w-40 rounded bg-slate-300" />

        </div>

        {/* Rows */}

        {[...Array(6)].map((_, index) => (

          <div
            key={index}
            className="flex items-center justify-between border-b p-5"
          >

            <div className="h-5 w-24 rounded bg-slate-200" />

            <div className="h-5 w-40 rounded bg-slate-200" />

            <div className="h-5 w-24 rounded bg-slate-200" />

            <div className="h-5 w-20 rounded bg-slate-200" />

            <div className="h-5 w-24 rounded bg-slate-200" />

            <div className="h-10 w-20 rounded-xl bg-slate-300" />

          </div>

        ))}

      </div>

    </div>

  );

}