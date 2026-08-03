interface SummaryItem {
  label: string;
  value: string;
  color?: string;
}

interface Props {
  items: SummaryItem[];
}

export default function ReportSummaryCards({
  items,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {items.map((item) => (

        <div
          key={item.label}
          className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
        >

          <p className="text-sm text-gray-500">
            {item.label}
          </p>

          <h2
            className={`
              mt-2
              text-2xl
              font-bold
              ${item.color ?? ""}
            `}
          >
            {item.value}
          </h2>

        </div>

      ))}

    </div>
  );
}
