import { useState } from "react";

import type { CustomerActivity } from "../../types/CustomerActivity";

import { activityIcons } from "./activityIcons";

import ActivityBadge from "./ActivityBadge";

interface Props {
  activities: CustomerActivity[];
}

const iconStyles: Record<CustomerActivity["type"], string> = {
  note: "bg-amber-100 text-amber-600",
  order: "bg-blue-100 text-blue-600",
  email: "bg-purple-100 text-purple-600",
  invoice: "bg-emerald-100 text-emerald-600",
  customer: "bg-slate-100 text-slate-600",
  status: "bg-green-100 text-green-600",
};

const filters = [
  { value: "", label: "All Activity" },
  { value: "note", label: "Notes" },
  { value: "order", label: "Orders" },
  { value: "email", label: "Emails" },
  { value: "invoice", label: "Invoices" },
  { value: "customer", label: "Customer" },
  { value: "status", label: "Status" },
];

export default function CustomerActivityTimeline({
  activities,
}: Props) {

  const [filter, setFilter] =
    useState("");

  function toDate(value: any) {

    if (!value) {

      return null;

    }

    if (typeof value.toDate === "function") {

      return value.toDate();

    }

    const parsed = new Date(value);

    return isNaN(parsed.getTime())
      ? null
      : parsed;

  }

  function formatRelative(value: any) {

    const date = toDate(value);

    if (!date) {

      return "-";

    }

    const seconds = Math.floor(
      (Date.now() - date.getTime()) / 1000
    );

    if (seconds < 60) {

      return "Just now";

    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {

      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {

      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

    }

    const days = Math.floor(hours / 24);

    if (days < 30) {

      return `${days} day${days !== 1 ? "s" : ""} ago`;

    }

    return date.toLocaleDateString();

  }

  const filteredActivities =
    filter === ""
      ? activities
      : activities.filter(
          (activity) => activity.type === filter
        );

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <h3 className="text-lg font-semibold">
          Activity Timeline
        </h3>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
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
        >

          {filters.map((item) => (

            <option
              key={item.value}
              value={item.value}
            >
              {item.label}
            </option>

          ))}

        </select>

      </div>

      {filteredActivities.length === 0 ? (

        <div className="py-10 text-center text-gray-500">
          No customer activity yet.
        </div>

      ) : (

        <div className="relative space-y-6">

          {/* Timeline Line */}

          <div className="absolute top-2 bottom-2 left-6 w-px bg-gray-200" />

          {filteredActivities.map((activity) => {

            const Icon = activityIcons[activity.type];

            return (

              <div
                key={activity.id}
                className="relative flex items-start gap-4"
              >

                {/* Timeline Icon */}

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
                    ${iconStyles[activity.type]}
                  `}
                >

                  <Icon size={18} />

                </div>

                {/* Activity Card */}

                <div
                  className="
                    flex-1
                    rounded-xl
                    border
                    bg-white
                    p-4
                    shadow-sm
                    transition
                    hover:shadow-md
                  "
                >

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <h4 className="font-semibold">
                      {activity.title}
                    </h4>

                    <ActivityBadge type={activity.type} />

                  </div>

                  <p className="mt-2 text-gray-600">
                    {activity.description}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">

                    {formatRelative(activity.createdAt)}

                    {toDate(activity.createdAt) && (

                      <span>
                        {" • "}
                        {toDate(activity.createdAt)?.toLocaleString()}
                      </span>

                    )}

                  </p>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}
