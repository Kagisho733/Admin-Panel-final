export type StockMovementType =
  | "in"
  | "out"
  | "adjustment";

export type StockStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock";

export interface StockMovement {

  id?: string;

  productId: string;

  productName: string;

  sku: string;

  type: StockMovementType;

  quantity: number;

  previousStock: number;

  newStock: number;

  reason: string;

  reference?: string;

  createdBy: string;

  createdAt?: any;

}
