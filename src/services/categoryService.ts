import type { Category } from "../types/Category";
import { apiRequest } from "./api/client";

interface ApiCategory {
  id: string; name: string; description: string; imageUrl?: string;
  storefrontDescription?: string; displayOrder?: number; showOnHomepage?: boolean;
  isActive: boolean; createdAt?: string;
}

const toCategory = (category: ApiCategory): Category => ({
  id: category.id,
  name: category.name,
  description: category.description,
  storefrontDescription: category.storefrontDescription || category.description,
  image: category.imageUrl || "",
  displayOrder: Number(category.displayOrder) || 0,
  showOnHomepage: category.showOnHomepage ?? true,
  productCount: 0,
  status: category.isActive ? "active" : "inactive",
  createdAt: category.createdAt,
});

const toPayload = (category: Omit<Category, "id">) => ({
  name: category.name,
  description: category.description,
  storefrontDescription: category.storefrontDescription,
  imageUrl: category.image || "",
  displayOrder: category.displayOrder,
  showOnHomepage: category.showOnHomepage,
  isActive: category.status === "active",
});

export async function getCategories() {
  const [categoryResponse, productResponse] = await Promise.all([
    apiRequest<{categories: ApiCategory[]}>("/categories", {}, false),
    apiRequest<{products: Array<{categoryId: string}>}>("/products", {}, false),
  ]);
  return categoryResponse.categories.map((category) => ({
    ...toCategory(category),
    productCount: productResponse.products.filter((product) => product.categoryId === category.id).length,
  }));
}
export async function getCategoryById(id: string) {
  const response = await apiRequest<{category: ApiCategory}>(`/categories/${id}`, {}, false);
  return toCategory(response.category);
}
export async function createCategory(category: Omit<Category, "id">, _performedBy?: string) {
  await apiRequest("/categories", {method: "POST", body: JSON.stringify(toPayload(category))});
}
export async function updateCategory(id: string, category: Omit<Category, "id">, _performedBy?: string) {
  await apiRequest(`/categories/${id}`, {method: "PUT", body: JSON.stringify(toPayload(category))});
}
export async function deleteCategory(id: string, _performedBy?: string, _categoryName?: string) {
  await apiRequest(`/categories/${id}`, {method: "DELETE"});
}
