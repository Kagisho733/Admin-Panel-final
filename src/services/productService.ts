import type { Product } from "../types/Product";
import { apiRequest } from "./api/client";

interface ApiProduct extends Pick<Product, "weight" | "length" | "width" | "height" | "packaging" | "lockerEligible"> {
  id: string; name: string; description: string; categoryId: string;
  categoryName?: string; brand?: string; price: number; stock: number;
  images?: string[]; isActive: boolean; isFeatured?: boolean; isNew?: boolean; isBestSeller: boolean;
  displayOrder?: number; showWhenOutOfStock?: boolean;
  costPrice?: number; minStock?: number; sku?: string; barcode?: string;
  createdAt: string; updatedAt: string;
}
interface ApiCategory { id: string; name: string; slug: string }

const toProduct = (product: ApiProduct): Product => ({
  id: product.id,
  weight: product.weight, length: product.length, width: product.width, height: product.height, packaging: product.packaging, lockerEligible: product.lockerEligible,
  name: product.name,
  description: product.description,
  category: product.categoryName || product.categoryId,
  brand: product.brand || "",
  sku: product.sku || "",
  barcode: product.barcode || "",
  price: Number(product.price) || 0,
  costPrice: Number(product.costPrice) || 0,
  stock: Number(product.stock) || 0,
  minStock: Number(product.minStock) || 0,
  status: product.isActive ? "Active" : "Hidden",
  featured: product.isFeatured ?? false,
  isNew: product.isNew ?? false,
  isBestSeller: product.isBestSeller ?? false,
  displayOrder: Number(product.displayOrder) || 0,
  showWhenOutOfStock: product.showWhenOutOfStock ?? true,
  imageUrl: product.images?.[0] || "",
  images: product.images || [],
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt),
});

async function toPayload(product: Partial<Product>) {
  const categories = await apiRequest<{categories: ApiCategory[]}>("/categories", {}, false);
  const category = categories.categories.find((item) =>
    item.id === product.category || item.name.toLowerCase() === product.category?.toLowerCase()
  );
  if (!category) throw new Error("Select a category that exists in the backend");
  return {
    weight: product.weight, length: product.length, width: product.width, height: product.height, packaging: product.packaging, lockerEligible: product.lockerEligible,
    name: product.name,
    description: product.description,
    categoryId: category.id,
    categoryName: category.name,
    brand: product.brand,
    price: product.price,
    stock: product.stock,
    costPrice: product.costPrice,
    minStock: product.minStock,
    sku: product.sku,
    barcode: product.barcode,
    images: product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [],
    isActive: product.status === "Active",
    isFeatured: Boolean(product.featured),
    isNew: Boolean(product.isNew),
    isBestSeller: Boolean(product.isBestSeller),
    displayOrder: Number(product.displayOrder) || 0,
    showWhenOutOfStock: product.showWhenOutOfStock ?? true,
  };
}

export async function getProducts() {
  const response = await apiRequest<{products: ApiProduct[]}>("/products");
  return response.products.map(toProduct);
}

export async function getProduct(id: string) {
  const response = await apiRequest<{product: ApiProduct}>(`/products/${id}`);
  return toProduct(response.product);
}

export async function createProduct(product: Product, _performedBy?: string) {
  return apiRequest("/products", {method: "POST", body: JSON.stringify(await toPayload(product))});
}

export async function updateProduct(id: string, product: Partial<Product>, _performedBy?: string) {
  return apiRequest(`/products/${id}`, {method: "PUT", body: JSON.stringify(await toPayload(product))});
}

export async function deleteProduct(id: string, _performedBy?: string, _productName?: string) {
  return apiRequest(`/products/${id}`, {method: "DELETE"});
}
