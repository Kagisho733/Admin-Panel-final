import type { Expense } from "../../types/Finance";

import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpensesTable({
  expenses,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-6 py-4 text-left">
              Date
            </th>

            <th className="px-6 py-4 text-left">
              Description
            </th>

            <th className="px-6 py-4 text-left">
              Category
            </th>

            <th className="px-6 py-4 text-left">
              Method
            </th>

            <th className="px-6 py-4 text-left">
              Amount
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {expenses.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="py-12 text-center text-gray-500"
              >

                No expenses found.

              </td>

            </tr>

          ) : (

            expenses.map((expense) => (

              <tr
                key={expense.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4 text-gray-600">
                  {expense.date}
                </td>

                <td className="px-6 py-4 font-semibold">

                  {expense.description}

                  {expense.reference && (

                    <p className="mt-1 text-sm font-normal text-gray-500">
                      Ref: {expense.reference}
                    </p>

                  )}

                </td>

                <td className="px-6 py-4">

                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {expense.category}
                  </span>

                </td>

                <td className="px-6 py-4 text-gray-600">
                  {expense.paymentMethod}
                </td>

                <td className="px-6 py-4 font-semibold text-red-600">
                  {formatCurrency(expense.amount ?? 0)}
                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(expense)}
                      className="
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(expense)}
                      className="
                        rounded-lg
                        bg-red-600
                        px-4
                        py-2
                        text-white
                        transition
                        hover:bg-red-700
                      "
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}
