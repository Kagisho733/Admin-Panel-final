import { FaDownload, FaEnvelope, FaTrash } from "react-icons/fa";

interface Props {
  selectedCount: number;
  onExport: () => void;
  onEmail: () => void;
  onDelete: () => void;
}

export default function CustomerBulkActions({
  selectedCount,
  onExport,
  onEmail,
  onDelete,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm">

      <div className="font-medium">
        {selectedCount} customer{selectedCount !== 1 ? "s" : ""} selected
      </div>

      <div className="flex gap-3">

        <button
          onClick={onExport}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <FaDownload className="mr-2 inline" />
          Export
        </button>

        <button
          onClick={onEmail}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          <FaEnvelope className="mr-2 inline" />
          Email
        </button>

        <button
          onClick={onDelete}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          <FaTrash className="mr-2 inline" />
          Delete
        </button>

      </div>

    </div>
  );
}