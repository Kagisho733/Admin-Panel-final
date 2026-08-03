import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaSms,
  FaHandshake,
  FaTrash,
} from "react-icons/fa";

import type { IconType } from "react-icons";

import type {
  CustomerCommunication,
  CommunicationChannel,
  CommunicationDirection,
} from "../../types/CustomerCommunication";

import {
  getCustomerCommunications,
  addCustomerCommunication,
  deleteCustomerCommunication,
} from "../../services/customerCommunicationService";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  customerId: string;
}

const channelIcons: Record<CommunicationChannel, IconType> = {
  email: FaEnvelope,
  phone: FaPhone,
  whatsapp: FaWhatsapp,
  sms: FaSms,
  meeting: FaHandshake,
};

const channelStyles: Record<CommunicationChannel, string> = {
  email: "bg-blue-100 text-blue-600",
  phone: "bg-emerald-100 text-emerald-600",
  whatsapp: "bg-green-100 text-green-600",
  sms: "bg-purple-100 text-purple-600",
  meeting: "bg-yellow-100 text-yellow-600",
};

export default function CustomerCommunications({
  customerId,
}: Props) {

  const { user } = useAuth();

  const [communications, setCommunications] =
    useState<CustomerCommunication[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [channel, setChannel] =
    useState<CommunicationChannel>("email");

  const [direction, setDirection] =
    useState<CommunicationDirection>("outbound");

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function loadCommunications() {

    try {

      const data =
        await getCustomerCommunications(customerId);

      setCommunications(data);

    } catch (error) {

      console.error(
        "Failed to load customer communications:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  async function handleSave() {

    if (!subject.trim()) {

      toast.error("Subject is required.");

      return;

    }

    setSaving(true);

    try {

      await addCustomerCommunication({

        customerId,

        channel,

        direction,

        subject: subject.trim(),

        message: message.trim(),

        createdBy: user?.email ?? "Unknown",

        createdAt: new Date(),

      });

      setSubject("");

      setMessage("");

      await loadCommunications();

      toast.success("Communication logged.");

    } catch (error) {

      console.error(
        "Failed to log communication:",
        error
      );

      toast.error("Failed to log communication.");

    } finally {

      setSaving(false);

    }

  }

  async function handleDelete(communicationId: string) {

    const confirmed = window.confirm(
      "Delete this communication?"
    );

    if (!confirmed) {

      return;

    }

    try {

      await deleteCustomerCommunication(communicationId);

      await loadCommunications();

      toast.success("Communication deleted.");

    } catch (error) {

      console.error(
        "Failed to delete communication:",
        error
      );

      toast.error("Failed to delete communication.");

    }

  }

  useEffect(() => {

    loadCommunications();

  }, [customerId]);

  return (
    <div className="space-y-6">

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 text-lg font-semibold">
          Log Communication
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          <select
            value={channel}
            onChange={(e) =>
              setChannel(
                e.target.value as CommunicationChannel
              )
            }
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              shadow-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
            "
          >

            <option value="email">Email</option>

            <option value="phone">Phone Call</option>

            <option value="whatsapp">WhatsApp</option>

            <option value="sms">SMS</option>

            <option value="meeting">Meeting</option>

          </select>

          <select
            value={direction}
            onChange={(e) =>
              setDirection(
                e.target.value as CommunicationDirection
              )
            }
            className="
              rounded-xl
              border
              border-gray-300
              bg-white
              px-4
              py-3
              shadow-sm
              outline-none
              transition
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-200
            "
          >

            <option value="outbound">Outbound</option>

            <option value="inbound">Inbound</option>

          </select>

        </div>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="
            mt-4
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-3
            shadow-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200
          "
        />

        <textarea
          placeholder="Message / summary"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="
            mt-4
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-3
            shadow-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-200
          "
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="
            mt-4
            rounded-lg
            bg-blue-600
            px-5
            py-2.5
            text-white
            transition
            hover:bg-blue-700
            disabled:opacity-50
          "
        >
          {saving ? "Saving..." : "Save Communication"}
        </button>

      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 text-lg font-semibold">
          Communication History
        </h3>

        {loading ? (

          <p className="text-sm text-gray-500">
            Loading communication history...
          </p>

        ) : communications.length === 0 ? (

          <p className="text-sm text-gray-500">
            No communication logged yet.
          </p>

        ) : (

          <div className="space-y-4">

            {communications.map((communication) => {

              const Icon =
                channelIcons[communication.channel];

              return (

                <div
                  key={communication.id}
                  className="
                    flex
                    items-start
                    gap-4
                    rounded-xl
                    border
                    p-4
                    transition
                    hover:bg-gray-50
                  "
                >

                  <div
                    className={`
                      flex
                      h-11
                      w-11
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-full
                      ${channelStyles[communication.channel]}
                    `}
                  >

                    <Icon size={16} />

                  </div>

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <h4 className="font-semibold">
                        {communication.subject}
                      </h4>

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${communication.direction === "inbound"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                          }
                        `}
                      >
                        {communication.direction === "inbound"
                          ? "Inbound"
                          : "Outbound"}
                      </span>

                    </div>

                    {communication.message && (

                      <p className="mt-2 text-gray-600">
                        {communication.message}
                      </p>

                    )}

                    <p className="mt-3 text-xs text-gray-400">

                      {communication.createdBy}

                      {" • "}

                      {communication.createdAt?.toDate
                        ? communication.createdAt
                            .toDate()
                            .toLocaleString()
                        : new Date(
                            communication.createdAt
                          ).toLocaleString()}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleDelete(communication.id)
                    }
                    className="text-gray-400 transition hover:text-red-600"
                  >
                    <FaTrash />
                  </button>

                </div>

              );

            })}

          </div>

        )}

      </div>

    </div>
  );
}
