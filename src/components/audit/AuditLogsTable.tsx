import type { AuditLog } from "../../types/AuditLog";

import AuditActionBadge from "./AuditActionBadge";

interface Props {
  logs: AuditLog[];
}

export default function AuditLogsTable({
  logs,
}: Props) {

  function formatTime(value: any) {

    if (!value) {

      return "-";

    }

    const date =
      typeof value.toDate === "function"
        ? value.toDate()
        : new Date(value);

    return isNaN(date.getTime())
      ? "-"
      : date.toLocaleString();

  }

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Date
            </th>

            <th className="px-6 py-4 text-left">
              Action
            </th>

            <th className="px-6 py-4 text-left">
              Module
            </th>

            <th className="px-6 py-4 text-left">
              Description
            </th>

            <th className="px-6 py-4 text-left">
              Performed By
            </th>

          </tr>

        </thead>

        <tbody>

          {logs.length === 0 ? (

            <tr>

              <td
                colSpan={5}
                className="py-12 text-center text-gray-500"
              >

                No audit records found.

              </td>

            </tr>

          ) : (

            logs.map((log) => (

              <tr
                key={log.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4 text-gray-600">
                  {formatTime(log.createdAt)}
                </td>

                <td className="px-6 py-4">

                  <AuditActionBadge action={log.action} />

                </td>

                <td className="px-6 py-4">

                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {log.module}
                  </span>

                </td>

                <td className="px-6 py-4">

                  {log.description}

                  {log.entityName && (

                    <p className="mt-1 text-sm text-gray-500">
                      {log.entityName}
                    </p>

                  )}

                </td>

                <td className="px-6 py-4 text-gray-600">
                  {log.performedBy}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}
