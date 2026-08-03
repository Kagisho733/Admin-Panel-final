import type { DateRange } from "../../types/Report";

interface Props {
  range: DateRange;
  onChange: (range: DateRange) => void;
}

export default function ReportDateRange({
  range,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4">

      <div>

        <label className="mb-2 block text-sm font-medium">
          From
        </label>

        <input
          type="date"
          value={range.from}
          onChange={(e) =>
            onChange({
              ...range,
              from: e.target.value,
            })
          }
          className="
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-2.5
            shadow-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200
          "
        />

      </div>

      <div>

        <label className="mb-2 block text-sm font-medium">
          To
        </label>

        <input
          type="date"
          value={range.to}
          onChange={(e) =>
            onChange({
              ...range,
              to: e.target.value,
            })
          }
          className="
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-2.5
            shadow-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200
          "
        />

      </div>

    </div>
  );
}
