import { useEffect, useState } from "react";

import type { User } from "../../types/User";
import ConfirmModal from "../../components/common/ConfirmModal";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import UserStats from "../../components/users/UserStats";

import {
  getUsers,
  updateUser,
  deleteUser,
} from "../../services/userService";

import UsersTable from "../../components/users/UsersTable";
import UserSearch from "../../components/users/UserSearch";
import UserRoleFilter from "../../components/users/UserRoleFilter";
import UserDetailsModal from "../../components/users/UserDetailsModal";
import EditUserModal from "../../components/users/EditUserModal";

export default function UsersPage() {

  const { user: authUser } = useAuth();

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [role, setRole] =
    useState("");

  const [sortField, setSortField] = useState<
    "firstName" | "email" | "role" | "totalOrders" | "totalSpent"
  >("firstName");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] =
    useState(1);

  const usersPerPage = 10;

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  const [deleteUserTarget, setDeleteUserTarget] =
    useState<User | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);


  async function loadUsers() {

    try {

      const data =
        await getUsers();

      setUsers(data);

    } catch (error) {

      console.error(
        "Error loading users:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  function handleViewUser(user: User) {

    setSelectedUser(user);

    setDetailsOpen(true);

  }

  function handleEditUser(user: User) {

    setEditingUser(user);

    setEditModalOpen(true);

  }

  function handleDeleteUser(user: User) {

    setDeleteUserTarget(user);

    setDeleteModalOpen(true);

  }

  async function handleSaveUser(
    user: User
  ) {

    if (!user.id) return;

    try {

      await updateUser(
        user.id,
        user,
        authUser?.email ?? "Unknown"
      );

      setEditModalOpen(false);

      setEditingUser(null);

      await loadUsers();

    } catch (error) {

      console.error(error);

    }

  }

  async function confirmDeleteUser() {

    if (!deleteUserTarget?.id) return;

    try {

      await deleteUser(
        deleteUserTarget.id,
        authUser?.email ?? "Unknown",
        `${deleteUserTarget.firstName} ${deleteUserTarget.lastName}`
      );

      toast.success(
        "User deleted successfully."
      );

      setDeleteModalOpen(false);

      setDeleteUserTarget(null);

      await loadUsers();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to delete user."
      );

    }

  }

  useEffect(() => {

    loadUsers();

  }, []);

  useEffect(() => {

    setCurrentPage(1);

  }, [search, role]);

  useEffect(() => {

    setCurrentPage(1);

  }, [sortField, sortDirection]);

  const filteredUsers = users.filter((user) => {

    const fullName =
      `${user.firstName} ${user.lastName}`.toLowerCase();

    const matchesSearch =

      fullName.includes(search.toLowerCase()) ||

      user.email
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =

      role === "" ||

      user.role === role;

    return (

      matchesSearch &&

      matchesRole

    );

  });

  const sortedUsers = [...filteredUsers].sort(
    (a, b) => {

      const direction =
        sortDirection === "asc" ? 1 : -1;

      switch (sortField) {

        case "firstName":
          return (
            a.firstName.localeCompare(b.firstName)
          ) * direction;

        case "email":
          return (
            a.email.localeCompare(b.email)
          ) * direction;

        case "role":
          return (
            a.role.localeCompare(b.role)
          ) * direction;

        case "totalOrders":
          return (
            (a.totalOrders - b.totalOrders)
          ) * direction;

        case "totalSpent":
          return (
            (a.totalSpent - b.totalSpent)
          ) * direction;

        default:
          return 0;

      }

    }
  );


  /*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

  const totalPages = Math.ceil(
    sortedUsers.length / usersPerPage
  );

  const indexOfLastUser =
    currentPage * usersPerPage;

  const indexOfFirstUser =
    indexOfLastUser - usersPerPage;

  const paginatedUsers =
    sortedUsers.slice(
      indexOfFirstUser,
      indexOfLastUser
    );


  if (loading) {

    return (

      <div className="text-center py-20">

        Loading Users...

      </div>

    );

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">

          Users

        </h1>

        <UserStats
          users={users}
        />



        <p className="mt-2 text-gray-500">

          Manage all users and their roles.

        </p>

      </div>

      <div className="flex flex-col md:flex-row gap-4">

        <UserSearch
          value={search}
          onChange={setSearch}
        />

        <UserRoleFilter
          value={role}
          onChange={setRole}
        />

      </div>
      <UsersTable
        users={paginatedUsers}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        sortField={sortField}
        sortDirection={sortDirection}
        setSortField={setSortField}
        setSortDirection={setSortDirection}
      />


      <UserDetailsModal
        open={detailsOpen}
        user={selectedUser}
        onClose={() => {

          setDetailsOpen(false);

          setSelectedUser(null);

        }}
      />

      <EditUserModal
        open={editModalOpen}
        user={editingUser}
        onClose={() => {

          setEditModalOpen(false);

          setEditingUser(null);

        }}
        onSave={handleSaveUser}
      />

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete User"
        message={
          deleteUserTarget
            ? `Are you sure you want to delete "${deleteUserTarget.firstName} ${deleteUserTarget.lastName}"?`
            : ""
        }
        confirmText="Delete User"
        cancelText="Cancel"
        onCancel={() => {

          setDeleteModalOpen(false);

          setDeleteUserTarget(null);

        }}
        onConfirm={confirmDeleteUser}
      />

      <div className="flex items-center justify-between mt-6">

        <p className="text-gray-600">

          Showing{" "}
          {sortedUsers.length === 0
            ? 0
            : indexOfFirstUser + 1}
          –
          {Math.min(
            indexOfLastUser,
            sortedUsers.length
          )}{" "}
          of {sortedUsers.length} users

        </p>

        <div className="flex gap-3">

          <button
            onClick={() =>
              setCurrentPage((page) =>
                Math.max(page - 1, 1)
              )
            }
            disabled={currentPage === 1}
            className="
        px-4
        py-2
        rounded-lg
        border
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
          >
            Previous
          </button>

          <span className="flex items-center px-3">

            Page {currentPage} of {totalPages || 1}

          </span>

          <button
            onClick={() =>
              setCurrentPage((page) =>
                Math.min(page + 1, totalPages)
              )
            }
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            className="
        px-4
        py-2
        rounded-lg
        border
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
          >
            Next
          </button>

        </div>

      </div>

    </div>



  );

}