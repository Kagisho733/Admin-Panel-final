export type PurchaseOrderStatus =
  | "draft"
  | "ordered"
  | "partially-received"
  | "received"
  | "cancelled";

export interface PurchaseOrderItem {

  productId: string;

  name: string;

  sku: string;

  quantity: number;

  receivedQuantity: number;

  unitCost: number;

}

export interface PurchaseOrder {

  id?: string;

  poNumber: string;

  supplierId: string;

  supplierName: string;

  items: PurchaseOrderItem[];

  subtotal: number;

  vatAmount: number;

  totalAmount: number;

  status: PurchaseOrderStatus;

  expectedDate: string;

  notes: string;

  createdBy: string;

  createdAt?: any;

  updatedAt?: any;

  receivedAt?: any;

}
