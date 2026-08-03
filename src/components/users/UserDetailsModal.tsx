import type { User } from "../../types/User";

interface Props {
    open: boolean;
    user: User | null;
    onClose: () => void;
}

export default function UserDetailsModal({
    open,
    user,
    onClose,
}: Props) {

    if (!open || !user) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">

                {/* Header */}

                <div className="flex justify-between items-center border-b p-6">

                    <h2 className="text-2xl font-bold">

                        User Details

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>

                </div>

                {/* Content */}

                <div className="p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Avatar */}

                        <div className="rounded-xl border p-5 flex items-center gap-4">

                            <div
                                className="
                                 h-20
                                  w-20
                                 rounded-full
                                  bg-gradient-to-br
                                  from-blue-500
                                     to-indigo-600
                                     flex
                                  items-center
                                 justify-center
                                  text-3xl
                                 font-bold
                                 text-white
                                 shadow-lg
                                 "
                            >

                                {user.avatar ? (

                                    <img
                                        src={user.avatar}
                                        alt={user.firstName}
                                        className="h-full w-full rounded-full object-cover"
                                    />

                                ) : (

                                    <>
                                        {user.firstName.charAt(0)}
                                        {user.lastName.charAt(0)}
                                    </>

                                )}

                            </div>

                            <div>

                                <p className="text-xl font-semibold">

                                    {user.firstName} {user.lastName}

                                </p>

                                <p className="text-gray-500">

                                    {user.email}

                                </p>

                            </div>

                        </div>

                        {/* Role */}

                        <div className="rounded-xl border p-5">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

                                Role

                            </h3>

                            <span
                                className={`
                                  mt-2
                                 inline-flex
                                  rounded-full
                                    px-3
                                      py-1
                                     text-sm
                                     font-semibold
                                     capitalize

                                     ${user.role === "admin"
                                        ? "bg-red-100 text-red-700"
                                        : user.role === "manager"
                                            ? "bg-purple-100 text-purple-700"
                                            : user.role === "seller"
                                                ? "bg-blue-100 text-blue-700"
                                                : user.role === "supplier"
                                                    ? "bg-orange-100 text-orange-700"
                                                    : user.role === "driver"
                                                        ? "bg-green-100 text-green-700"
                                                        : user.role === "support"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-700"
                                    }
  `}
                            >

                                {user.role}

                            </span>

                        </div>

                        {/* Phone */}

                        <div className="rounded-xl border p-5">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

                                Phone

                            </h3>

                            <p className="mt-2 text-lg">

                                {user.phone}

                            </p>

                        </div>

                        {/* Orders */}

                        <div className="rounded-xl border p-5">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

                                Total Orders

                            </h3>

                            <p className="mt-2 text-2xl font-bold">

                                {user.totalOrders}

                            </p>

                        </div>

                        {/* Total Spent */}

                        <div className="rounded-xl border p-5">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

                                Total Spent

                            </h3>

                            <p className="mt-2 text-3xl font-bold text-green-600">

                                R{user.totalSpent.toFixed(2)}

                            </p>

                        </div>

                        <div className="rounded-xl border p-5">

                            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">

                                Registered

                            </h3>

                            <p className="mt-2 text-lg">

                                {user.createdAt?.toDate
                                    ? user.createdAt
                                        .toDate()
                                        .toLocaleDateString()
                                    : "—"}

                            </p>

                        </div>

                    </div>

                    <div className="mt-8 flex justify-end">

                        <button
                            onClick={onClose}
                            className="
                rounded-xl
                bg-gray-800
                px-6
                py-3
                text-white
                hover:bg-black
              "
                        >
                            Close
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}