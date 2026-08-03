/*
|--------------------------------------------------------------------------
| Product Service
|--------------------------------------------------------------------------
| Handles every Firestore operation related to products.
|--------------------------------------------------------------------------
*/

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Product } from "../types/Product";

import { logAudit } from "./auditLogService";

const productsCollection = collection(db, "products");

/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export async function createProduct(

  product: Product,

  performedBy: string = "Unknown"

) {

  const created = await addDoc(productsCollection, product);

  await logAudit({

    action: "create",

    module: "products",

    entityId: created.id,

    entityName: product.name,

    description: `Product "${product.name}" was created.`,

    performedBy,

  });

  return created;

}

/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/

export async function getProducts() {

  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map(doc => ({

    id: doc.id,

    ...doc.data(),

  })) as Product[];

}

/*
|--------------------------------------------------------------------------
| Get One Product
|--------------------------------------------------------------------------
*/

export async function getProduct(id: string) {

  const productRef = doc(db, "products", id);

  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {

    return null;

  }

  return {

    id: snapshot.id,

    ...snapshot.data(),

  } as Product;

}

/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export async function updateProduct(

  id: string,

  product: Partial<Product>,

  performedBy: string = "Unknown"

) {

  const productRef = doc(db, "products", id);

  const result = await updateDoc(productRef, product);

  await logAudit({

    action: "update",

    module: "products",

    entityId: id,

    entityName: product.name ?? "",

    description: `Product "${product.name ?? id}" was updated.`,

    performedBy,

  });

  return result;

}

/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export async function deleteProduct(

  id: string,

  performedBy: string = "Unknown",

  productName: string = ""

) {

  const productRef = doc(db, "products", id);

  const result = await deleteDoc(productRef);

  await logAudit({

    action: "delete",

    module: "products",

    entityId: id,

    entityName: productName,

    description: `Product "${productName || id}" was deleted.`,

    performedBy,

  });

  return result;

}