/*
|--------------------------------------------------------------------------
| Expense Categories
|--------------------------------------------------------------------------
| Centralized list of expense categories used by the finance module.
|--------------------------------------------------------------------------
*/

import type { Expense } from "../types/Finance";

export const expenseCategories = [

  "Rent",

  "Salaries",

  "Utilities",

  "Marketing",

  "Transport",

  "Packaging",

  "Software",

  "Equipment",

  "Bank Charges",

  "Insurance",

  "Other",

];

export const paymentMethods = [

  { value: "cash", label: "Cash" },

  { value: "card", label: "Card" },

  { value: "eft", label: "EFT" },

  { value: "debit-order", label: "Debit Order" },

  { value: "other", label: "Other" },

];

export const defaultExpense: Expense = {

  description: "",

  category: "Other",

  amount: 0,

  vatAmount: 0,

  date: new Date().toISOString().slice(0, 10),

  paymentMethod: "eft",

  reference: "",

  notes: "",

  createdBy: "",

};
