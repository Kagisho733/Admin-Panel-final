import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { FaTrash } from "react-icons/fa";

import type { CustomerNote } from "../../types/CustomerNote";

import {
  getCustomerNotes,
  addCustomerNote,
  deleteCustomerNote,
} from "../../services/customerNotesService";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  customerId: string;
}

export default function CustomerNotes({
  customerId,
}: Props) {

  const { user } = useAuth();

  const [notes, setNotes] =
    useState<CustomerNote[]>([]);

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  async function loadNotes() {

    try {

      const data =
        await getCustomerNotes(customerId);

      setNotes(data);

    } catch (error) {

      console.error(
        "Failed to load customer notes:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  async function handleAddNote() {

    if (!note.trim()) {

      toast.error("Note cannot be empty.");

      return;

    }

    setSaving(true);

    try {

      await addCustomerNote({

        customerId,

        note: note.trim(),

        createdBy: user?.email ?? "Unknown",

        createdAt: new Date(),

      });

      setNote("");

      await loadNotes();

      toast.success("Note added.");

    } catch (error) {

      console.error(
        "Failed to add customer note:",
        error
      );

      toast.error("Failed to add note.");

    } finally {

      setSaving(false);

    }

  }

  async function handleDeleteNote(noteId: string) {

    const confirmed = window.confirm(
      "Delete this note?"
    );

    if (!confirmed) {

      return;

    }

    try {

      await deleteCustomerNote(noteId);

      await loadNotes();

      toast.success("Note deleted.");

    } catch (error) {

      console.error(
        "Failed to delete customer note:",
        error
      );

      toast.error("Failed to delete note.");

    }

  }

  useEffect(() => {

    loadNotes();

  }, [customerId]);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold">
        Notes
      </h3>

      <textarea
        placeholder="Write a note about this customer..."
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="
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
        onClick={handleAddNote}
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
        {saving ? "Saving..." : "Add Note"}
      </button>

      <div className="mt-6 space-y-4">

        {loading ? (

          <p className="text-sm text-gray-500">
            Loading notes...
          </p>

        ) : notes.length === 0 ? (

          <p className="text-sm text-gray-500">
            No notes for this customer yet.
          </p>

        ) : (

          notes.map((item) => (

            <div
              key={item.id}
              className="
                flex
                items-start
                justify-between
                gap-4
                rounded-xl
                border
                p-4
                transition
                hover:bg-gray-50
              "
            >

              <div>

                <p className="text-gray-700">
                  {item.note}
                </p>

                <p className="mt-3 text-xs text-gray-400">

                  {item.createdBy}

                  {" • "}

                  {item.createdAt?.toDate
                    ? item.createdAt
                        .toDate()
                        .toLocaleString()
                    : new Date(
                        item.createdAt
                      ).toLocaleString()}

                </p>

              </div>

              <button
                onClick={() =>
                  handleDeleteNote(item.id)
                }
                className="text-gray-400 transition hover:text-red-600"
              >
                <FaTrash />
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}
