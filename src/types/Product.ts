/*
|--------------------------------------------------------------------------
| Product Type
|--------------------------------------------------------------------------
| Represents one product stored in Firestore.
|--------------------------------------------------------------------------
*/

export interface Product {
  id?: string;

  name: string;

  description: string;

  category: string;

  brand: string;

  sku: string;

  barcode: string;  

  price: number;

  costPrice: number;

  stock: number;

  minStock: number;

  status: "Active" | "Hidden";

  featured: boolean;

  imageUrl: string;

  createdAt: Date;

  updatedAt: Date;
}