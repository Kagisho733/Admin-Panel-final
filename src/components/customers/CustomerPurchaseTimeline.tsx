import type { Customer } from "../../types/Customer";

interface Props {
  customer: Customer;
}

export default function CustomerPurchaseTimeline({
  customer,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="mb-4 text-lg font-bold">
        Purchase Timeline
      </h3>

      <div className="space-y-4">

        <div className="flex items-center justify-between border-l-4 border-blue-500 pl-4">
          <div>
            <p className="font-semibold">
              Customer Created
            </p>

            <p className="text-sm text-gray-500">
              {customer.createdAt
                ? new Date(
                    customer.createdAt.toDate?.() ??
                    customer.createdAt
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-l-4 border-green-500 pl-4">
          <div>
            <p className="font-semibold">
              Last Purchase
            </p>

            <p className="text-sm text-gray-500">
              {customer.lastOrderDate
                ? new Date(
                    customer.lastOrderDate.toDate?.() ??
                    customer.lastOrderDate
                  ).toLocaleDateString()
                : "No orders yet"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}