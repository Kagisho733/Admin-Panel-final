/*
|--------------------------------------------------------------------------
| Default Purchase Order
|--------------------------------------------------------------------------
| Empty purchase order used when creating a new order.
|--------------------------------------------------------------------------
*/

import type { PurchaseOrder } from "../types/PurchaseOrder";

export const vatRate = 0.15;

export const defaultPurchaseOrder: PurchaseOrder = {

  poNumber: "",

  supplierId: "",

  supplierName: "",

  items: [],

  subtotal: 0,

  vatAmount: 0,

  totalAmount: 0,

  status: "draft",

  expectedDate: "",

  notes: "",

  createdBy: "",

};
