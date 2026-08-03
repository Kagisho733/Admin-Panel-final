import { useEffect, useState } from "react";

import type { Customer } from "../../types/Customer";

import type { CustomerActivity }
  from "../../types/CustomerActivity";

import {
  getCustomerActivities,
} from "../../services/customerActivityService";

import CustomerActivityTimeline
  from "./CustomerActivityTimeline";

import CustomerNotes from "./CustomerNotes";

import CustomerTags from "./CustomerTags";

import CustomerAttachments from "./CustomerAttachments";

import CustomerCommunications from "./CustomerCommunications";

import CustomerPurchaseHistory from "./CustomerPurchaseHistory";

import { formatCurrency } from "../../utils/formatCurrency";

interface Props {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onUpdated?: (customer: Customer) => void;
}

type Tab =
  | "overview"
  | "orders"
  | "notes"
  | "activity"
  | "communication"
  | "attachments";

const tabs: { value: Tab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "orders", label: "Orders" },
  { value: "notes", label: "Notes" },
  { value: "activity", label: "Activity" },
  { value: "communication", label: "Communication" },
  { value: "attachments", label: "Attachments" },
];

export default function CustomerDetailsModal({
  open,
  customer,
  onClose,
  onUpdated,
}: Props) {

  const [activities, setActivities] =
    useState<CustomerActivity[]>([]);

  const [tab, setTab] =
    useState<Tab>("overview");

  const [tags, setTags] =
    useState<string[]>([]);

  async function loadActivities(customerId: string) {

    try {

      const data = await getCustomerActivities(customerId);

      setActivities(data);

    } catch (error) {

      console.error(
        "Failed to load customer activities:",
        error
      );

    }

  }

  function handleTagsChange(updatedTags: string[]) {

    setTags(updatedTags);

    if (customer && onUpdated) {

      onUpdated({
        ...customer,
        tags: updatedTags,
      });

    }

  }

  useEffect(() => {

    if (!open || !customer) {

      return;

    }

    setTab("overview");

    setTags(customer.tags ?? []);

    loadActivities(customer.id);

  }, [open, customer]);

  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              {customer.fullName}
            </h2>

            <p className="mt-1 text-gray-500">
              {customer.email}
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 transition hover:text-black"
          >
            ✕
          </button>

        </div>

        {/* Tabs */}

        <div className="flex flex-wrap gap-2 border-b px-6 py-4">

          {tabs.map((item) => (

            <button
              key={item.value}
              onClick={() => setTab(item.value)}
              className={`
                rounded-xl
                px-4
                py-2
                text-sm
                font-medium
                transition

                ${tab === item.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200"
                }
              `}
            >
              {item.label}
            </button>

          ))}

        </div>

        {/* Body */}

        <div className="flex-1 space-y-6 overflow-y-auto bg-gray-50 p-6">

          {tab === "overview" && (

            <>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="rounded-2xl border bg-white p-6 shadow-sm">

                  <h3 className="mb-3 font-semibold">
                    Contact Information
                  </h3>

                  <p className="text-gray-600">
                    Email: {customer.email}
                  </p>

                  <p className="mt-1 text-gray-600">
                    Phone: {customer.phone || "-"}
                  </p>

                </div>

                <div className="rounded-2xl border bg-white p-6 shadow-sm">

                  <h3 className="mb-3 font-semibold">
                    Address
                  </h3>

                  <p className="text-gray-600">
                    {customer.address || "-"}
                  </p>

                  <p className="mt-1 text-gray-600">

                    {customer.city || "-"}

                    {" "}

                    {customer.province || ""}

                  </p>

                  <p className="mt-1 text-gray-600">
                    {customer.postalCode || "-"}
                  </p>

                </div>

              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">

                <h3 className="mb-4 text-lg font-semibold">
                  Account Summary
                </h3>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">

                  <div>

                    <p className="text-sm text-gray-500">
                      Total Orders
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                      {customer.totalOrders}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Total Spent
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-600">
                      {formatCurrency(customer.totalSpent ?? 0)}
                    </p>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Last Order
                    </p>

                    <p className="mt-2 text-lg font-semibold">

                      {customer.lastOrderDate
                        ? new Date(
                            customer.lastOrderDate?.toDate?.() ??
                            customer.lastOrderDate
                          ).toLocaleDateString()
                        : "-"}

                    </p>

                  </div>

                </div>

              </div>

              <CustomerTags
                customerId={customer.id}
                tags={tags}
                onChange={handleTagsChange}
              />

            </>

          )}

          {tab === "orders" && (

            <CustomerPurchaseHistory
              customerEmail={customer.email}
            />

          )}

          {tab === "notes" && (

            <CustomerNotes customerId={customer.id} />

          )}

          {tab === "activity" && (

            <CustomerActivityTimeline
              activities={activities}
            />

          )}

          {tab === "communication" && (

            <CustomerCommunications
              customerId={customer.id}
            />

          )}

          {tab === "attachments" && (

            <CustomerAttachments
              customerId={customer.id}
            />

          )}

        </div>

      </div>

    </div>
  );
}
