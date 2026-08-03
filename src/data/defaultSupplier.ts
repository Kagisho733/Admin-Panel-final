/*
|--------------------------------------------------------------------------
| Default Supplier
|--------------------------------------------------------------------------
| Empty supplier used when creating a new supplier record.
|--------------------------------------------------------------------------
*/

import type { Supplier } from "../types/Supplier";

export const defaultSupplier: Supplier = {

  name: "",

  contactPerson: "",

  email: "",

  phone: "",

  address: "",

  city: "",

  province: "",

  postalCode: "",

  vatNumber: "",

  paymentTerms: "30 Days",

  notes: "",

  status: "active",

  totalOrders: 0,

  totalSpent: 0,

};

export const paymentTermsOptions = [

  "Cash On Delivery",

  "7 Days",

  "14 Days",

  "30 Days",

  "60 Days",

];
