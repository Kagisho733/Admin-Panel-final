import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { updateAdminProfile } from "../../services/profileService";

export default function AdminProfile() {

  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!user) return;

    const names = (user.displayName ?? "").split(" ");

    setFirstName(names[0] ?? "");
    setLastName(names.slice(1).join(" "));
  }, [user]);

  async function handleSave() {
    if (!user) return;

    try {
      await updateAdminProfile(user.uid, {
        firstName,
        lastName,
        phone,
      });

      await refreshUser();

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    }
  }

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="text-2xl font-bold">

        Administrator Profile

      </h2>

      <div className="mt-8 space-y-6">

        <div>

          <label className="text-sm text-gray-500">

            Email

          </label>

          <input
            disabled
            value={user?.email ?? ""}
            className="mt-2 w-full rounded-lg border bg-gray-100 p-3"
          />

        </div>

        <div>
          <label className="text-sm text-gray-500">
            First Name
          </label>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Last Name
          </label>

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">
            Phone Number
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>

          <label className="text-sm text-gray-500">

            Role

          </label>

          <input
            disabled
            value={user?.role ?? ""}
            className="mt-2 w-full rounded-lg border bg-gray-100 p-3"
          />

        </div>
        <button
          onClick={handleSave}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>

    </div>

  );

}