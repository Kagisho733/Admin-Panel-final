interface Props {
  selectedCount: number;

  onDelete: () => void;

  onStatusUpdate: () => void;

  onClearSelection: () => void;

  onPrint: () => void;

  onExport: () => void;
}

export default function BulkActions({
  selectedCount,
  onDelete,
  onStatusUpdate,
  onExport,
  onPrint,
  onClearSelection,
}: Props) {


  if (selectedCount === 0) {
    return null;
  }

  return (

    <div
      className="
      sticky
      top-4
      z-20
      mb-6
      flex
      items-center
      justify-between
      rounded-2xl
      border
      border-blue-200
      bg-blue-50
      px-6
      py-4
      shadow-md
    "
    >

      <div className="font-semibold text-blue-900">

        ✓ {selectedCount} order{selectedCount > 1 ? "s" : ""} selected

      </div>

      <div className="flex gap-3">

        <button
          onClick={onStatusUpdate}
          className="
            rounded-lg
            bg-green-600
            px-4
            py-2
            text-white
            hover:bg-green-700
            transition
          "
        >
          Update Status
        </button>

        <button
          onClick={onDelete}
          className="
            rounded-lg
            bg-red-600
            px-4
            py-2
            text-white
            hover:bg-red-700
            transition
          "
        >
          Delete
        </button>

        <button
          onClick={onClearSelection}
          className="
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-2
            hover:bg-gray-100
            transition
          "
        >
          Clear Selection
        </button>

        <button
          onClick={onPrint}
          className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800 transition"
        >
          🖨 Print
        </button>


        <button
          onClick={onExport}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition"
        >
          📥 Export CSV
        </button>

      </div>

    </div>

  );

}