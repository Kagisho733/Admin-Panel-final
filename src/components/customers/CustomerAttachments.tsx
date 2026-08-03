import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import {
  FaFileAlt,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

import type { CustomerAttachment }
from "../../types/CustomerAttachment";

import {
  getCustomerAttachments,
  uploadCustomerAttachment,
  deleteCustomerAttachment,
} from "../../services/customerAttachmentService";

import { useAuth } from "../../hooks/useAuth";

interface Props {
  customerId: string;
}

export default function CustomerAttachments({
  customerId,
}: Props) {

  const { user } = useAuth();

  const [attachments, setAttachments] =
    useState<CustomerAttachment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  async function loadAttachments() {

    try {

      const data =
        await getCustomerAttachments(customerId);

      setAttachments(data);

    } catch (error) {

      console.error(
        "Failed to load customer attachments:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  async function handleUpload(file: File | null) {

    if (!file) {

      return;

    }

    setUploading(true);

    try {

      await uploadCustomerAttachment(
        customerId,
        file,
        user?.email ?? "Unknown"
      );

      await loadAttachments();

      toast.success("Attachment uploaded.");

    } catch (error) {

      console.error(
        "Failed to upload attachment:",
        error
      );

      toast.error("Failed to upload attachment.");

    } finally {

      setUploading(false);

    }

  }

  async function handleDelete(attachmentId: string) {

    const confirmed = window.confirm(
      "Delete this attachment?"
    );

    if (!confirmed) {

      return;

    }

    try {

      await deleteCustomerAttachment(attachmentId);

      await loadAttachments();

      toast.success("Attachment deleted.");

    } catch (error) {

      console.error(
        "Failed to delete attachment:",
        error
      );

      toast.error("Failed to delete attachment.");

    }

  }

  function formatSize(bytes: number) {

    if (bytes < 1024) {

      return `${bytes} B`;

    }

    if (bytes < 1024 * 1024) {

      return `${(bytes / 1024).toFixed(1)} KB`;

    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  }

  useEffect(() => {

    loadAttachments();

  }, [customerId]);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">

        <h3 className="text-lg font-semibold">
          Attachments
        </h3>

        <label
          className="
            cursor-pointer
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
            transition
            hover:bg-blue-700
          "
        >

          {uploading ? "Uploading..." : "Upload File"}

          <input
            type="file"
            disabled={uploading}
            onChange={(e) =>
              handleUpload(
                e.target.files?.[0] ?? null
              )
            }
            className="hidden"
          />

        </label>

      </div>

      {loading ? (

        <p className="text-sm text-gray-500">
          Loading attachments...
        </p>

      ) : attachments.length === 0 ? (

        <p className="text-sm text-gray-500">
          No attachments uploaded yet.
        </p>

      ) : (

        <div className="space-y-3">

          {attachments.map((attachment) => (

            <div
              key={attachment.id}
              className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                rounded-xl
                border
                p-4
                transition
                hover:bg-gray-50
              "
            >

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-blue-100 p-3">

                  <FaFileAlt
                    className="text-blue-600"
                    size={18}
                  />

                </div>

                <div>

                  <p className="font-medium">
                    {attachment.fileName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {formatSize(attachment.fileSize)}
                    {" • "}
                    {attachment.uploadedBy}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    rounded-lg
                    bg-slate-100
                    px-3
                    py-2
                    transition
                    hover:bg-slate-200
                  "
                >
                  <FaDownload />
                </a>

                <button
                  onClick={() =>
                    handleDelete(attachment.id)
                  }
                  className="
                    rounded-lg
                    bg-red-600
                    px-3
                    py-2
                    text-white
                    transition
                    hover:bg-red-700
                  "
                >
                  <FaTrash />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}
