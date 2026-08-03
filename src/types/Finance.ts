export type PaymentMethod =
  | "cash"
  | "card"
  | "eft"
  | "debit-order"
  | "other";

export interface Expense {

  id?: string;

  description: string;

  category: string;

  amount: number;

  vatAmount: number;

  date: string;

  paymentMethod: PaymentMethod;

  supplierId?: string;

  supplierName?: string;

  reference: string;

  notes: string;

  createdBy: string;

  createdAt?: any;

  updatedAt?: any;

}

export interface FinanceSummary {

  revenue: number;

  expenses: number;

  purchases: number;

  grossProfit: number;

  netProfit: number;

  margin: number;

}

export interface MonthlyFinancePoint {

  month: string;

  revenue: number;

  expenses: number;

  profit: number;

}
