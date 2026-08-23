export type PromotionType = "percentage" | "fixed";

export interface Promotion {
  id: string;
  code: string;
  type: PromotionType;
  value: number;
  minimumSpend: number;
  startsAt?: string;
  endsAt?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type PromotionInput = Omit<Promotion, "id" | "createdAt" | "updatedAt">;
