/*
|--------------------------------------------------------------------------
| Inventory Service
|--------------------------------------------------------------------------
| Inventory is derived from the existing products collection. Every stock
| change is written to the stockMovements collection so the full history
| stays auditable.
|--------------------------------------------------------------------------
*/

import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Product } from "../types/Product";

import type {
  StockMovement,
  StockMovementType,
  StockStatus,
} from "../types/Inventory";

import { createNotification } from "./notificationService";

import { logAudit } from "./auditLogService";

const stockMovementsCollection = collection(
  db,
  "stockMovements"
);

/*
|--------------------------------------------------------------------------
| Get Stock Movements
|--------------------------------------------------------------------------
*/

export async function getStockMovements(): Promise<StockMovement[]> {

  const q = query(
    stockMovementsCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<StockMovement, "id">),
  }));

}

/*
|--------------------------------------------------------------------------
| Get Product Stock Movements
|--------------------------------------------------------------------------
*/

export async function getProductStockMovements(
  productId: string
): Promise<StockMovement[]> {

  const movements = await getStockMovements();

  return movements.filter(
    movement => movement.productId === productId
  );

}

/*
|--------------------------------------------------------------------------
| Get Stock Status
|--------------------------------------------------------------------------
*/

export function getStockStatus(
  product: Product
): StockStatus {

  const stock = product.stock ?? 0;

  const minStock = product.minStock ?? 0;

  if (stock <= 0) {

    return "out-of-stock";

  }

  if (stock <= minStock) {

    return "low-stock";

  }

  return "in-stock";

}

/*
|--------------------------------------------------------------------------
| Get Inventory Value
|--------------------------------------------------------------------------
| Total value of the stock on hand, based on the product cost price.
|--------------------------------------------------------------------------
*/

export function getInventoryValue(
  products: Product[]
): number {

  return products.reduce(
    (total, product) =>
      total +
      (product.stock ?? 0) *
      (product.costPrice ?? 0),
    0
  );

}

/*
|--------------------------------------------------------------------------
| Get Retail Value
|--------------------------------------------------------------------------
*/

export function getRetailValue(
  products: Product[]
): number {

  return products.reduce(
    (total, product) =>
      total +
      (product.stock ?? 0) *
      (product.price ?? 0),
    0
  );

}

/*
|--------------------------------------------------------------------------
| Get Low Stock Products
|--------------------------------------------------------------------------
*/

export function getLowStockProducts(
  products: Product[]
): Product[] {

  return products.filter(
    product =>
      getStockStatus(product) === "low-stock"
  );

}

/*
|--------------------------------------------------------------------------
| Get Out Of Stock Products
|--------------------------------------------------------------------------
*/

export function getOutOfStockProducts(
  products: Product[]
): Product[] {

  return products.filter(
    product =>
      getStockStatus(product) === "out-of-stock"
  );

}

/*
|--------------------------------------------------------------------------
| Adjust Stock
|--------------------------------------------------------------------------
| Applies a stock change to a product, records the movement and raises a
| notification whenever the product drops to or below its minimum level.
|--------------------------------------------------------------------------
*/

export async function adjustStock(
  product: Product,
  type: StockMovementType,
  quantity: number,
  reason: string,
  createdBy: string,
  reference?: string
): Promise<number> {

  if (!product.id) {

    throw new Error("Product id is required.");

  }

  const previousStock = product.stock ?? 0;

  let newStock = previousStock;

  if (type === "in") {

    newStock = previousStock + quantity;

  }

  if (type === "out") {

    newStock = previousStock - quantity;

  }

  if (type === "adjustment") {

    newStock = quantity;

  }

  if (newStock < 0) {

    newStock = 0;

  }

  const productRef = doc(
    db,
    "products",
    product.id
  );

  await updateDoc(productRef, {

    stock: newStock,

    updatedAt: new Date(),

  });

  await addDoc(stockMovementsCollection, {

    productId: product.id,

    productName: product.name,

    sku: product.sku ?? "",

    type,

    quantity,

    previousStock,

    newStock,

    reason,

    reference: reference ?? "",

    createdBy,

    createdAt: new Date(),

  });

  await logAudit({

    action: "update",

    module: "inventory",

    entityId: product.id,

    entityName: product.name,

    description:
      `Stock changed from ${previousStock} to ${newStock} (${reason}).`,

    performedBy: createdBy,

  });

  const minStock = product.minStock ?? 0;

  if (newStock <= 0) {

    await createNotification({

      title: "Out Of Stock",

      message: `${product.name} is now out of stock.`,

      type: "error",

      module: "inventory",

      link: "/inventory",

    });

  } else if (newStock <= minStock) {

    await createNotification({

      title: "Low Stock Warning",

      message:
        `${product.name} has dropped to ${newStock} units (minimum ${minStock}).`,

      type: "warning",

      module: "inventory",

      link: "/inventory",

    });

  }

  return newStock;

}

/*
|--------------------------------------------------------------------------
| Receive Stock
|--------------------------------------------------------------------------
| Convenience wrapper used by the purchasing module when goods arrive.
|--------------------------------------------------------------------------
*/

export async function receiveStock(
  product: Product,
  quantity: number,
  reference: string,
  createdBy: string
): Promise<number> {

  return await adjustStock(
    product,
    "in",
    quantity,
    "Purchase order received",
    createdBy,
    reference
  );

}
