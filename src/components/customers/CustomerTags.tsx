import { useState } from "react";

import toast from "react-hot-toast";

import { customerTags } from "../../data/customerTags";

import CustomerTagBadge from "./CustomerTagBadge";

import {
  addCustomerTag,
  removeCustomerTag,
} from "../../services/customerTagService";

interface Props {
  customerId: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function CustomerTags({
  customerId,
  tags,
  onChange,
}: Props) {

  const [saving, setSaving] =
    useState(false);

  const availableTags =
    customerTags.filter(
      (tag) => !tags.includes(tag)
    );

  async function handleAddTag(tag: string) {

    if (!tag || tags.includes(tag)) {

      return;

    }

    setSaving(true);

    try {

      await addCustomerTag(customerId, tag);

      onChange([...tags, tag]);

      toast.success("Tag added.");

    } catch (error) {

      console.error(
        "Failed to add customer tag:",
        error
      );

      toast.error("Failed to add tag.");

    } finally {

      setSaving(false);

    }

  }

  async function handleRemoveTag(tag: string) {

    setSaving(true);

    try {

      await removeCustomerTag(customerId, tag);

      onChange(
        tags.filter(
          (current) => current !== tag
        )
      );

      toast.success("Tag removed.");

    } catch (error) {

      console.error(
        "Failed to remove customer tag:",
        error
      );

      toast.error("Failed to remove tag.");

    } finally {

      setSaving(false);

    }

  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold">
        Tags
      </h3>

      {tags.length === 0 ? (

        <p className="text-sm text-gray-500">
          No tags assigned yet.
        </p>

      ) : (

        <div className="flex flex-wrap gap-2">

          {tags.map((tag) => (

            <CustomerTagBadge
              key={tag}
              tag={tag}
              onRemove={() => handleRemoveTag(tag)}
            />

          ))}

        </div>

      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">

        <select
          value=""
          disabled={saving || availableTags.length === 0}
          onChange={(e) =>
            handleAddTag(e.target.value)
          }
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
            disabled:opacity-50
          "
        >

          <option value="">
            Add a tag...
          </option>

          {availableTags.map((tag) => (

            <option
              key={tag}
              value={tag}
            >
              {tag}
            </option>

          ))}

        </select>

        {saving && (

          <span className="text-sm text-gray-500">
            Saving...
          </span>

        )}

      </div>

    </div>
  );
}
