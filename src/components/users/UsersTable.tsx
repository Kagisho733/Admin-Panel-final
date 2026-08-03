import type { User } from "../../types/User";

interface Props {

  users: User[];

  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;

  sortField:
  | "firstName"
  | "email"
  | "role"
  | "totalOrders"
  | "totalSpent";

  sortDirection: "asc" | "desc";

  setSortField: React.Dispatch<
    React.SetStateAction<
      | "firstName"
      | "email"
      | "role"
      | "totalOrders"
      | "totalSpent"
    >
  >;

  setSortDirection: React.Dispatch<
    React.SetStateAction<"asc" | "desc">
  >;

}
export default function UsersTable({

  users,

  onView,

  onEdit,
  onDelete,

  sortField,

  sortDirection,

  setSortField,

  setSortDirection,

}: Props) {

  function handleSort(
    field:
      | "firstName"
      | "email"
      | "role"
      | "totalOrders"
      | "totalSpent"
  ) {

    if (sortField === field) {

      setSortDirection((previous) =>

        previous === "asc"

          ? "desc"

          : "asc"

      );

    } else {

      setSortField(field);

      setSortDirection("asc");

    }

  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">

      <table className="min-w-full">

        <thead className="bg-gray-100">

          <tr>

            <th
              onClick={() => handleSort("firstName")}
              className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
            >
              Name{" "}

              {sortField === "firstName" && (

                sortDirection === "asc"

                  ? "▲"

                  : "▼"

              )}

            </th>

            <th
              onClick={() => handleSort("email")}
              className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
            >
              Email{" "}

              {sortField === "email" && (

                sortDirection === "asc"

                  ? "▲"

                  : "▼"

              )}
            </th>
            <th
              onClick={() => handleSort("role")}
              className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
            >
              Role{" "}

              {sortField === "role" && (

                sortDirection === "asc"

                  ? "▲"

                  : "▼"

              )}
            </th>

            <th
              onClick={() => handleSort("totalOrders")}
              className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
            >
              Orders{" "}

              {sortField === "totalOrders" && (

                sortDirection === "asc"

                  ? "▲"

                  : "▼"

              )}
            </th>

            <th
              onClick={() => handleSort("totalSpent")}
              className="
    cursor-pointer
    select-none
    px-6
    py-4
    text-left
  "
            >
              Total Spent{" "}

              {sortField === "totalSpent" && (

                sortDirection === "asc"

                  ? "▲"

                  : "▼"

              )}
            </th>

            <th
              className="
    px-6
    py-4
    text-left
  "
            >
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {users.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="py-10 text-center text-gray-500"
              >
                No users found.
              </td>

            </tr>

          ) : (

            users.map((user) => (

              <tr
                key={user.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">

                  {user.firstName} {user.lastName}

                </td>

                <td className="px-6 py-4">

                  {user.email}

                </td>

                <td className="px-6 py-4">

                  {user.role}

                </td>

                <td className="px-6 py-4">

                  {user.totalOrders}

                </td>

                <td className="px-6 py-4">

                  R{user.totalSpent.toFixed(2)}

                </td>

                <td className="space-x-2">

                  <button
                    onClick={() => onView(user)}
                    className="
      rounded-lg
      bg-sky-600
      px-3
      py-2
      text-white
    "
                  >
                    View
                  </button>

                  <button
                    onClick={() => onEdit(user)}
                    className="
      rounded-lg
      bg-amber-500
      px-3
      py-2
      text-white
    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="
    rounded-lg
    bg-red-600
    px-3
    py-2
    text-white
    hover:bg-red-700
  "
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>



    </div>
  );
}