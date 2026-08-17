import { getCollectionRecords, type CollectionRecord } from "./collectionService";
export interface CustomerSummary {uid:string;displayName:string;email:string}
export interface ActivityProduct {id:string;name:string;sku:string;price:number;imageUrl:string}
export interface ActivityItem {productId:string;quantity:number;addedAt?:string;product:ActivityProduct;lineTotal:number}
export interface PaymentRecord extends CollectionRecord {customer:CustomerSummary;reference:string;orderId:string;amount:number;currency?:string;status:string;provider?:string;channel?:string;createdAt:string;paidAt?:string}
export interface CustomerActivityRecord extends CollectionRecord {customer:CustomerSummary;items:ActivityItem[];itemCount:number;subtotal:number;updatedAt:string;createdAt?:string}
export async function getPayments(){return (await getCollectionRecords("payments")).records as unknown as PaymentRecord[]}
export async function getCarts(){return (await getCollectionRecords("carts")).records as unknown as CustomerActivityRecord[]}
export async function getWishlists(){return (await getCollectionRecords("wishlists")).records as unknown as CustomerActivityRecord[]}
