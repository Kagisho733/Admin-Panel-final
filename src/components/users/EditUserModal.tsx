import { useEffect, useState } from "react";

import type {
    User,
    UserRole,
} from "../../types/User";

interface Props {

    open: boolean;

    user: User | null;

    onClose: () => void;

    onSave: (user: User) => Promise<void>;

}

export default function EditUserModal({

    open,

    user,

    onClose,

    onSave,

}: Props) {

    const [formData, setFormData] =
        useState<User | null>(null);

    useEffect(() => {

        setFormData(user);

    }, [user]);

    if (!open || !formData) return null;

    async function handleSubmit(
        event: React.FormEvent
    ) {

        event.preventDefault();
        if (!formData) return;

        await onSave(formData);

    }

    function updateField<
        K extends keyof User
    >(
        field: K,
        value: User[K]
    ) {

        setFormData((previous) =>

            previous
                ? {
                    ...previous,
                    [field]: value,
                }
                : previous

        );

    }

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
            >

                <div className="border-b p-6 flex justify-between">

                    <h2 className="text-2xl font-bold">

                        Edit User

                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ✕

                    </button>

                </div>

                <div className="p-6 space-y-6"></div>

                <div>

                    <label className="block mb-2">

                        First Name

                    </label>

                    <input
                        value={formData.firstName}
                        onChange={(e) =>
                            updateField(
                                "firstName",
                                e.target.value
                            )
                        }
                        className="
      w-full
      rounded-lg
      border
      px-4
      py-3
    "
                    />

                </div>

                <div>

                    <label className="block mb-2">

                        Last Name

                    </label>

                    <input
                        value={formData.lastName}
                        onChange={(e) =>
                            updateField(
                                "lastName",
                                e.target.value
                            )
                        }
                        className="
      w-full
      rounded-lg
      border
      px-4
      py-3
    "
                    />

                </div>

                <div>

                    <label className="block mb-2">

                        Email

                    </label>

                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            updateField(
                                "email",
                                e.target.value
                            )
                        }
                        className="
      w-full
      rounded-lg
      border
      px-4
      py-3
    "
                    />

                </div>

                <div>

                    <label className="block mb-2">

                        Phone

                    </label>

                    <input
                        value={formData.phone}
                        onChange={(e) =>
                            updateField(
                                "phone",
                                e.target.value
                            )
                        }
                        className="
      w-full
      rounded-lg
      border
      px-4
      py-3
    "
                    />

                </div>

                <div>

                    <label className="block mb-2">

                        Role

                    </label>

                    <select
                        value={formData.role}
                        onChange={(e) =>
                            updateField(
                                "role",
                                e.target.value as UserRole
                            )
                        }
                        className="
      w-full
      rounded-lg
      border
      px-4
      py-3
    "
                    >

                        <option value="customer">
                            Customer
                        </option>

                        <option value="admin">
                            Admin
                        </option>

                        <option value="manager">
                            Manager
                        </option>

                        <option value="seller">
                            Seller
                        </option>

                        <option value="supplier">
                            Supplier
                        </option>

                        <option value="driver">
                            Driver
                        </option>

                        <option value="support">
                            Support
                        </option>

                    </select>

                </div>

                <div className="flex justify-end gap-4 border-t p-6">

                    <button
                        type="button"
                        onClick={onClose}
                        className="
      rounded-lg
      border
      px-5
      py-2
    "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="
      rounded-lg
      bg-blue-600
      px-5
      py-2
      text-white
      hover:bg-blue-700
    "
                    >
                        Save Changes
                    </button>

                </div>

            </form>

        </div>

    );

}