import type { Promotion, PromotionInput } from "../types/Promotion";
import { apiRequest } from "./api/client";

export async function getPromotions() {
  return (await apiRequest<{promotions: Promotion[]}>("/promotions")).promotions;
}

export async function savePromotion(input: PromotionInput, id?: string) {
  const path = id ? `/promotions/${id}` : "/promotions";
  return apiRequest<{promotion: Promotion}>(path, {method: id ? "PUT" : "POST", body: JSON.stringify(input)});
}

export async function setPromotionActive(promotion: Promotion, active: boolean) {
  const {code, type, value, minimumSpend, startsAt = "", endsAt = ""} = promotion;
  return savePromotion({code, type, value, minimumSpend, startsAt, endsAt, active}, promotion.id);
}
