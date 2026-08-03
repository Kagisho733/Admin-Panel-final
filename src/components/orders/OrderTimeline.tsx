import {
  FaShoppingCart,
  FaCogs,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import type { IconType } from "react-icons";

import type { Order, OrderStatus } from "../../types/Order";

interface Props {
  order: Order;
}

interface Step {
  status: OrderStatus;
  label: string;
  icon: IconType;
}

const steps: Step[] = [
  { status: "pending", label: "Order Placed", icon: FaShoppingCart },
  { status: "processing", label: "Processing", icon: FaCogs },
  { status: "shipped", label: "Shipped", icon: FaTruck },
  { status: "delivered", label: "Delivered", icon: FaCheckCircle },
];

export default function OrderTimeline({
  order,
}: Props) {

  function formatDate(value: any) {

    if (!value) {

      return "";

    }

    const date =
      typeof value.toDate === "function"
        ? value.toDate()
        : new Date(value);

    return isNaN(date.getTime())
      ? ""
      : date.toLocaleString();

  }

  if (order.status === "cancelled") {

    return (

      <div className="rounded-xl border border-red-200 bg-red-50 p-5">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">

            <FaTimesCircle
              className="text-red-600"
              size={20}
            />

          </div>

          <div>

            <h4 className="font-semibold text-red-800">
              Order Cancelled
            </h4>

            <p className="mt-1 text-sm text-red-700">
              This order will not be fulfilled.
            </p>

          </div>

        </div>

      </div>

    );

  }

  const currentIndex = steps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="rounded-xl border bg-white p-5">

      <h4 className="mb-6 font-semibold">
        Order Progress
      </h4>

      <div className="relative space-y-6">

        {/* Timeline Line */}

        <div className="absolute top-2 bottom-2 left-6 w-px bg-gray-200" />

        {steps.map((step, index) => {

          const Icon = step.icon;

          const reached = index <= currentIndex;

          return (

            <div
              key={step.status}
              className="relative flex items-center gap-4"
            >

              <div
                className={`
                  z-10
                  flex
                  h-12
                  w-12
                  flex-shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ring-4
                  ring-white

                  ${reached
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400"
                  }
                `}
              >

                <Icon size={18} />

              </div>

              <div>

                <p
                  className={`
                    font-medium

                    ${reached
                      ? "text-gray-900"
                      : "text-gray-400"
                    }
                  `}
                >
                  {step.label}
                </p>

                {index === 0 && (

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(order.createdAt)}
                  </p>

                )}

                {index === currentIndex && index !== 0 && (

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(order.updatedAt ?? order.createdAt)}
                  </p>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}
