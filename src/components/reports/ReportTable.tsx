interface Props {
  headers: string[];
  rows: (string | number)[][];
  emptyMessage?: string;
}

export default function ReportTable({
  headers,
  rows,
  emptyMessage = "No data for the selected period.",
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            {headers.map((header) => (

              <th
                key={header}
                className="px-6 py-4 text-left"
              >
                {header}
              </th>

            ))}

          </tr>

        </thead>

        <tbody>

          {rows.length === 0 ? (

            <tr>

              <td
                colSpan={headers.length}
                className="py-12 text-center text-gray-500"
              >

                {emptyMessage}

              </td>

            </tr>

          ) : (

            rows.map((row, rowIndex) => (

              <tr
                key={rowIndex}
                className="border-t hover:bg-gray-50"
              >

                {row.map((cell, cellIndex) => (

                  <td
                    key={cellIndex}
                    className={`
                      px-6
                      py-4

                      ${cellIndex === 0
                        ? "font-semibold"
                        : "text-gray-600"
                      }
                    `}
                  >
                    {cell}
                  </td>

                ))}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}
