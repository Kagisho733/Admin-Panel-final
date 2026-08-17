import type { User, UserRole } from "../types/User";
import { apiRequest } from "./api/client";

interface ApiUser {
  uid?: string; id?: string; name?: string; firstName?: string; lastName?: string;
  email: string; phone?: string; role?: string; createdAt?: string;
  totalOrders?: number; totalSpent?: number;
}

const toUser = (user: ApiUser): User => {
  const nameParts = (user.name || "").trim().split(/\s+/).filter(Boolean);
  return {
    id: user.uid || user.id,
    firstName: user.firstName || nameParts[0] || "User",
    lastName: user.lastName || nameParts.slice(1).join(" "),
    email: user.email || "",
    phone: user.phone || "",
    role: (user.role === "admin" ? "admin" : "customer") as UserRole,
    totalOrders: Number(user.totalOrders) || 0,
    totalSpent: Number(user.totalSpent) || 0,
    createdAt: user.createdAt,
  };
};

export async function getUsers() {
  const response = await apiRequest<{users: ApiUser[]}>("/admin/users");
  return response.users.map(toUser);
}

export async function updateUser(id: string, user: User, _performedBy?: string) {
  const response = await apiRequest<{user: ApiUser}>(`/admin/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({role: user.role}),
  });
  return toUser(response.user);
}

export async function deleteUser(id?: string, _performedBy?: string, _userName?: string) {
  if (!id) throw new Error("User ID is required");
  await apiRequest(`/admin/users/${id}`, {method: "DELETE"});
}
