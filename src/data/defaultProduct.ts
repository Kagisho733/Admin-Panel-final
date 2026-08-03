import type { Product } from "../types/Product";

export const defaultProduct: Product = {
  name: "",
  description: "",
  category: "",
  brand: "",
  sku: "",
  barcode: "",
  price: 0,
  costPrice: 0,
  stock: 0,
  minStock: 0,
  status: "Active",
  featured: false,
  imageUrl: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};