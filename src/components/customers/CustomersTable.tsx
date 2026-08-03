import type { Customer } from "../../types/Customer";

import CustomerTagBadge from "./CustomerTagBadge";

interface Props {
  customers: Customer[];

  selectedCustomers: string[];

  toggleCustomer: (customerId: string) => void;

  toggleAllCustomers: () => void;

  onView: (customer: Customer) => void;

  sortField:
    | "customer"
    | "orders"
    | "spent"
    | "lastOrder";

  sortDirection: "asc" | "desc";

  setSortField: React.Dispatch<
    React.SetStateAction<
      "customer" |
      "orders" |
      "spent" |
      "lastOrder"
    >
  >;

  setSortDirection: React.Dispatch<
    React.SetStateAction<"asc" | "desc">
  >;
}

export default function CustomerTable({
  customers,
  selectedCustomers,
  toggleCustomer,
  toggleAllCustomers,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  onView,
}: Props) {


function handleSort(
  field:
    | "customer"
    | "orders"
    | "spent"
    | "lastOrder"
) {

  if (sortField === field) {

    setSortDirection(
      sortDirection === "asc"
        ? "desc"
        : "asc"
    );

  } else {

    setSortField(field);

    setSortDirection("asc");

  }

}

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="px-4 py-4 text-center">

              <input
                type="checkbox"
                checked={
                  customers.length > 0 &&
                  selectedCustomers.length === customers.length
                }
                onChange={toggleAllCustomers}
                className="h-4 w-4 cursor-pointer"
              />

            </th>

           <th
  onClick={() => handleSort("customer")}
  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
>
  <div className="flex items-center gap-2">

    Customer

    {sortField === "customer" && (
      <span>
        {sortDirection === "asc"
          ? "▲"
          : "▼"}
      </span>
    )}

  </div>
</th>

            <th className="px-6 py-4 text-left">
              Email
            </th>

          <th
  onClick={() => handleSort("orders")}
  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
>
  <div className="flex items-center gap-2">

    Orders

    {sortField === "orders" && (
      <span>
        {sortDirection === "asc"
          ? "▲"
          : "▼"}
      </span>
    )}

  </div>
</th>

           <th
  onClick={() => handleSort("spent")}
  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
>
  <div className="flex items-center gap-2">

    Total Spent

    {sortField === "spent" && (
      <span>
        {sortDirection === "asc"
          ? "▲"
          : "▼"}
      </span>
    )}

  </div>
</th>

           <th
  onClick={() => handleSort("lastOrder")}
  className="px-6 py-4 text-left cursor-pointer hover:bg-gray-200 select-none transition"
>
  <div className="flex items-center gap-2">

    Last Order

    {sortField === "lastOrder" && (
      <span>
        {sortDirection === "asc"
          ? "▲"
          : "▼"}
      </span>
    )}

  </div>
</th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {customers.length === 0 ? (

            <tr>

              <td
                colSpan={7}
                className="py-12 text-center text-gray-500"
              >

                No customers found.

              </td>

            </tr>

          ) : (

            customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-t hover:bg-gray-50"
              >


<td className="px-4 py-4 text-center">

  <input
    type="checkbox"
    checked={selectedCustomers.includes(customer.id)}
    onChange={() => toggleCustomer(customer.id)}
    className="h-4 w-4 cursor-pointer"
  />

</td>
                <td className="px-6 py-4 font-semibold">

                  {customer.fullName}

                  {(customer.tags ?? []).length > 0 && (

                    <div className="mt-2 flex flex-wrap gap-1">

                      {(customer.tags ?? []).map((tag) => (

                        <CustomerTagBadge
                          key={tag}
                          tag={tag}
                        />

                      ))}

                    </div>

                  )}

                </td>
                <td className="px-6 py-4">

                  {customer.email}

                </td>
                <td className="px-6 py-4">

                  {customer.totalOrders}

                </td>
                <td className="px-6 py-4">

                  R{customer.totalSpent.toFixed(2)}

                </td>
                <td className="px-6 py-4">

                  {customer.lastOrderDate
                    ? new Date(
                        customer.lastOrderDate?.toDate?.() ??
                        customer.lastOrderDate
                      ).toLocaleDateString()
                    : "-"}

                </td>

                <td className="px-6 py-4 text-center">

               <button
  onClick={() => onView(customer)}
  className="
    rounded-lg
    bg-blue-600
    px-4
    py-2
    text-white
    hover:bg-blue-700
    transition
  "
>
  👁 View
</button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}