interface Order {
  id: string;
  customer: string;
  total: string;
  status: string;
}

interface Props {
  orders: Order[];
}

export default function RecentOrders({ orders }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        Recent Orders
      </h2>


      {orders.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          <p className="text-lg font-medium">
            No recent orders
          </p>

          <p className="mt-2 text-sm">
            Orders will appear here once customers begin purchasing.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">

          {orders.map((order) => (

            

            <div
              key={order.id}
              className="flex justify-between border-b pb-2"
            >

              <div>

                <p className="font-semibold">
                  {order.id}
                </p>

                <p className="text-gray-500 text-sm">
                  {order.customer}
                </p>

              </div>

              <div className="text-right">

                <p>{order.total}</p>

                <p className="text-green-600 text-sm">
                  {order.status}
                </p>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}