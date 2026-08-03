/*
|--------------------------------------------------------------------------
| Default Order
|--------------------------------------------------------------------------
| Empty order used when capturing a new order manually.
|--------------------------------------------------------------------------
*/

import type { Order } from "../types/Order";

export const defaultOrder: Order = {

  customerName: "",

  customerEmail: "",

  customerPhone: "",

  items: [],

  totalAmount: 0,

  status: "pending",

  paymentStatus: "unpaid",

  notes: "",

};

export const paymentStatusOptions = [

  { value: "unpaid", label: "Unpaid" },

  { value: "partially-paid", label: "Partially Paid" },

  { value: "paid", label: "Paid" },

  { value: "refunded", label: "Refunded" },

];

export const orderStatusOptions = [

  { value: "pending", label: "Pending" },

  { value: "processing", label: "Processing" },

  { value: "shipped", label: "Shipped" },

  { value: "delivered", label: "Delivered" },

  { value: "cancelled", label: "Cancelled" },

];
