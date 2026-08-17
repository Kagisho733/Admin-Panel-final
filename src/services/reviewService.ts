import { apiRequest } from "./api/client";
import { getCollectionRecords, type CollectionRecord } from "./collectionService";
export interface ReviewRecord extends CollectionRecord {customer:{uid:string;displayName:string;email:string};product:{id:string;name:string;sku:string;imageUrl:string};rating:number;comment:string;status:string;createdAt:string;updatedAt:string}
export async function getAdminReviews(){return (await getCollectionRecords("reviews")).records as unknown as ReviewRecord[]}
export async function deleteAdminReview(id:string){await apiRequest(`/reviews/${id}`,{method:"DELETE"})}
