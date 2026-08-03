export type ReportType =
  | "sales"
  | "inventory"
  | "purchasing"
  | "finance";

export interface DateRange {

  from: string;

  to: string;

}

export interface SalesReportRow {

  period: string;

  orders: number;

  revenue: number;

}

export interface TopProductRow {

  name: string;

  quantity: number;

  revenue: number;

}

export interface ReportTotals {

  orders: number;

  revenue: number;

  averageOrderValue: number;

}
