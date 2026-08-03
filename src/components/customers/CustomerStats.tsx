import {
    FaUsers,
    FaUserCheck,
    FaMoneyBillWave,
    FaCrown,
} from "react-icons/fa";

interface Props {
    totalCustomers: number;
    activeCustomers: number;
    totalRevenue: number;
    topCustomer: string;
}

export default function CustomerStats({
    totalCustomers,
    activeCustomers,
    totalRevenue,
    topCustomer,
}: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm text-gray-500">
                            Total Customers
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {totalCustomers}
                        </h2>

                    </div>

                    <div className="rounded-xl bg-blue-100 p-4">

                        <FaUsers
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
        Active Customers
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {activeCustomers}
      </h2>

    </div>

    <div className="rounded-xl bg-green-100 p-4">

      <FaUserCheck
        className="text-green-600"
        size={24}
      />

    </div>

  </div>

</div>

         <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg">

  <div className="flex items-center justify-between">

    <div>

      <p className="text-sm text-gray-500">
        Revenue
      </p>

      <h2 className="mt-2 text-3xl font-bold text-green-600">
        R{totalRevenue.toLocaleString("en-ZA")}
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
        Top Customer
      </p>

      <h2 className="mt-2 text-xl font-bold">
        {topCustomer}
      </h2>

    </div>

    <div className="rounded-xl bg-yellow-100 p-4">

      <FaCrown
        className="text-yellow-500"
        size={24}
      />

    </div>

  </div>

</div>

        </div>
    );
}