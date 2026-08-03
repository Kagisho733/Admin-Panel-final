import { getRevenueAnalytics } from "./revenueAnalytics";

import { getOrderAnalytics } from "./orderAnalytics";

import { getProductAnalytics } from "./productAnalytics";

import { getUserAnalytics } from "./userAnalytics";

import { getCategoryAnalytics } from "./categoryAnalytics";

import type { Analytics } from "../types/Analytics";


export async function getAnalytics(): Promise<Analytics> {

  const [

  revenue,

  orders,

  products,

  users,

  categories,

] = await Promise.all([

  getRevenueAnalytics(),

  getOrderAnalytics(),

  getProductAnalytics(),

  getUserAnalytics(),

  getCategoryAnalytics(),

]);

return {

  ...revenue,

  ...orders,

  ...products,

  ...users,

  ...categories,

};

}