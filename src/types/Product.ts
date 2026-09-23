/*
|--------------------------------------------------------------------------
| Product Type
|--------------------------------------------------------------------------
| Represents one product stored in Firestore.
|--------------------------------------------------------------------------
*/

export interface Product {
  id?: string;
  weight?: number; // Packed kg
  length?: number; // Packed cm
  width?: number;
  height?: number;
  packaging?: string;
  lockerEligible?: boolean;

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

  isNew: boolean;

  isBestSeller: boolean;

  displayOrder: number;

  showWhenOutOfStock: boolean;

  imageUrl: string;

  images: string[];

  createdAt: Date;

  updatedAt: Date;
}
