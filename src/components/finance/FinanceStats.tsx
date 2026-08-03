import {
  FaMoneyBillWave,
  FaShoppingBasket,
  FaReceipt,
  FaChartLine,
} from "react-icons/fa";

import type { FinanceSummary } from "../../types/Finance";

import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  summary: FinanceSummary;
}

export default function FinanceStats({
  summary,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Revenue
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {formatCurrency(summary.revenue)}
            </h2>

          </div>

          <div className="rounded-xl bg-emerald-100 p-4">

            <FaMoneyBillWave
              className="text-emerald-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Stock Purchases
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {formatCurrency(summary.purchases)}
            </h2>

          </div>

          <div className="rounded-xl bg-blue-100 p-4">

            <FaShoppingBasket
              className="text-blue-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Expenses
            </p>

            <h2 className="mt-2 text-2xl font-bold text-red-600">
              {formatCurrency(summary.expenses)}
            </h2>

          </div>

          <div className="rounded-xl bg-red-100 p-4">

            <FaReceipt
              className="text-red-600"
              size={24}
            />

          </div>

        </div>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Net Profit
            </p>

            <h2
              className={`
                mt-2
                text-2xl
                font-bold

                ${summary.netProfit >= 0
                  ? "text-green-600"
                  : "text-red-600"
                }
              `}
            >
              {formatCurrency(summary.netProfit)}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Margin {summary.margin.toFixed(1)}%
            </p>

          </div>

          <div className="rounded-xl bg-yellow-100 p-4">

            <FaChartLine
              className="text-yellow-600"
              size={24}
            />

          </div>

        </div>

      </div>

    </div>
  );
}
