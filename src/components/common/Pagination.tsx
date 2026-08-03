interface Props {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;

  onPageChange: (page: number) => void;

  onRowsPerPageChange: (rows: number) => void;

  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalItems,
}: Props) {

  const start =
    totalItems === 0
      ? 0
      : (currentPage - 1) * rowsPerPage + 1;

  const end = Math.min(
    currentPage * rowsPerPage,
    totalItems
  );

  return (

    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <p className="text-sm text-gray-500">

        Showing {start}–{end} of {totalItems} orders

      </p>

      <div className="flex items-center gap-3">

        <select
          value={rowsPerPage}
          onChange={(e) =>
            onRowsPerPageChange(
              Number(e.target.value)
            )
          }
          className="rounded-lg border px-3 py-2"
        >

          <option value={10}>10</option>

          <option value={25}>25</option>

          <option value={50}>50</option>

          <option value={100}>100</option>

        </select>

        <button
          disabled={currentPage === 1}
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          className="
            rounded-lg
            border
            px-4
            py-2
            disabled:opacity-40
          "
        >
          Previous
        </button>

        <span className="font-medium">

          {currentPage} / {Math.max(totalPages, 1)}

        </span>

        <button
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          className="
            rounded-lg
            border
            px-4
            py-2
            disabled:opacity-40
          "
        >
          Next
        </button>

      </div>

    </div>

  );

}