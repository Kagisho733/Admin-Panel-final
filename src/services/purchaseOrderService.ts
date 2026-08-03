/*
|--------------------------------------------------------------------------
| Purchase Order Service
|--------------------------------------------------------------------------
| Handles purchase orders and pushes received goods into the inventory
| module so stock levels stay accurate.
|--------------------------------------------------------------------------
*/

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type {
  PurchaseOrder,
  PurchaseOrderItem,
  PurchaseOrderStatus,
} from "../types/PurchaseOrder";

import type { Product } from "../types/Product";

import { vatRate } from "../data/defaultPurchaseOrder";

import { receiveStock } from "./inventoryService";

import { getProduct } from "./productService";

import { getSupplierById, updateSupplier } from "./supplierService";

import { createNotification } from "./notificationService";

import { logAudit } from "./auditLogService";

const purchaseOrdersCollection = collection(
  db,
  "purchaseOrders"
);

/*
|--------------------------------------------------------------------------
| Calculate Purchase Order Totals
|--------------------------------------------------------------------------
*/

export function calculatePurchaseOrderTotals(
  items: PurchaseOrderItem[]
) {

  const subtotal = items.reduce(
    (sum, item) =>
      sum + item.quantity * item.unitCost,
    0
  );

  const vatAmount = subtotal * vatRate;

  const totalAmount = subtotal + vatAmount;

  return {
    subtotal,
    vatAmount,
    totalAmount,
  };

}

/*
|--------------------------------------------------------------------------
| Generate PO Number
|--------------------------------------------------------------------------
*/

export function generatePurchaseOrderNumber(): string {

  const now = new Date();

  const stamp =
    `${now.getFullYear()}` +
    `${String(now.getMonth() + 1).padStart(2, "0")}` +
    `${String(now.getDate()).padStart(2, "0")}` +
    `${String(now.getHours()).padStart(2, "0")}` +
    `${String(now.getMinutes()).padStart(2, "0")}`;

  return `PO-${stamp}`;

}

/*
|--------------------------------------------------------------------------
| Get All Purchase Orders
|--------------------------------------------------------------------------
*/

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {

  const q = query(
    purchaseOrdersCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<PurchaseOrder, "id">),
  }));

}

/*
|--------------------------------------------------------------------------
| Get Purchase Order By ID
|--------------------------------------------------------------------------
*/

export async function getPurchaseOrderById(
  purchaseOrderId: string
): Promise<PurchaseOrder | null> {

  const orderRef = doc(
    db,
    "purchaseOrders",
    purchaseOrderId
  );

  const snapshot = await getDoc(orderRef);

  if (!snapshot.exists()) {

    return null;

  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<PurchaseOrder, "id">),
  };

}

/*
|--------------------------------------------------------------------------
| Create Purchase Order
|--------------------------------------------------------------------------
*/

export async function createPurchaseOrder(
  purchaseOrder: PurchaseOrder
): Promise<string> {

  const totals =
    calculatePurchaseOrderTotals(purchaseOrder.items);

  const created = await addDoc(purchaseOrdersCollection, {

    ...purchaseOrder,

    ...totals,

    createdAt: new Date(),

    updatedAt: new Date(),

  });

  await logAudit({

    action: "create",

    module: "purchasing",

    entityId: created.id,

    entityName: purchaseOrder.poNumber,

    description:
      `Purchase order ${purchaseOrder.poNumber} was created for ${purchaseOrder.supplierName}.`,

    performedBy: purchaseOrder.createdBy,

  });

  return created.id;

}

/*
|--------------------------------------------------------------------------
| Update Purchase Order
|--------------------------------------------------------------------------
*/

export async function updatePurchaseOrder(
  purchaseOrderId: string,
  purchaseOrder: Partial<PurchaseOrder>,
  performedBy: string
): Promise<void> {

  const orderRef = doc(
    db,
    "purchaseOrders",
    purchaseOrderId
  );

  const payload: Record<string, any> = {

    ...purchaseOrder,

    updatedAt: new Date(),

  };

  if (purchaseOrder.items) {

    const totals =
      calculatePurchaseOrderTotals(purchaseOrder.items);

    payload.subtotal = totals.subtotal;

    payload.vatAmount = totals.vatAmount;

    payload.totalAmount = totals.totalAmount;

  }

  await updateDoc(orderRef, payload);

  await logAudit({

    action: "update",

    module: "purchasing",

    entityId: purchaseOrderId,

    entityName: purchaseOrder.poNumber ?? "",

    description: `Purchase order was updated.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Update Purchase Order Status
|--------------------------------------------------------------------------
*/

export async function updatePurchaseOrderStatus(
  purchaseOrderId: string,
  status: PurchaseOrderStatus,
  performedBy: string
): Promise<void> {

  const orderRef = doc(
    db,
    "purchaseOrders",
    purchaseOrderId
  );

  await updateDoc(orderRef, {

    status,

    updatedAt: new Date(),

  });

  await logAudit({

    action: "status",

    module: "purchasing",

    entityId: purchaseOrderId,

    entityName: purchaseOrderId,

    description: `Purchase order status changed to ${status}.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Receive Purchase Order
|--------------------------------------------------------------------------
| Adds the received quantities to product stock, records the movements and
| updates the supplier totals.
|--------------------------------------------------------------------------
*/

export async function receivePurchaseOrder(
  purchaseOrder: PurchaseOrder,
  receivedQuantities: Record<string, number>,
  performedBy: string
): Promise<void> {

  if (!purchaseOrder.id) {

    throw new Error("Purchase order id is required.");

  }

  const updatedItems: PurchaseOrderItem[] = [];

  for (const item of purchaseOrder.items) {

    const receivedNow =
      receivedQuantities[item.productId] ?? 0;

    if (receivedNow > 0) {

      const product: Product | null =
        await getProduct(item.productId);

      if (product) {

        await receiveStock(
          { ...product, id: item.productId },
          receivedNow,
          purchaseOrder.poNumber,
          performedBy
        );

      }

    }

    updatedItems.push({

      ...item,

      receivedQuantity:
        (item.receivedQuantity ?? 0) + receivedNow,

    });

  }

  const fullyReceived = updatedItems.every(
    (item) => item.receivedQuantity >= item.quantity
  );

  const partiallyReceived = updatedItems.some(
    (item) => item.receivedQuantity > 0
  );

  const status: PurchaseOrderStatus =
    fullyReceived
      ? "received"
      : partiallyReceived
        ? "partially-received"
        : purchaseOrder.status;

  const orderRef = doc(
    db,
    "purchaseOrders",
    purchaseOrder.id
  );

  await updateDoc(orderRef, {

    items: updatedItems,

    status,

    updatedAt: new Date(),

    receivedAt: fullyReceived
      ? new Date()
      : (purchaseOrder.receivedAt ?? null),

  });

  if (fullyReceived && purchaseOrder.supplierId) {

    const supplier =
      await getSupplierById(purchaseOrder.supplierId);

    if (supplier) {

      await updateSupplier(
        purchaseOrder.supplierId,
        {
          name: supplier.name,
          totalOrders: (supplier.totalOrders ?? 0) + 1,
          totalSpent:
            (supplier.totalSpent ?? 0) +
            (purchaseOrder.totalAmount ?? 0),
        },
        performedBy
      );

    }

  }

  await createNotification({

    title: fullyReceived
      ? "Purchase Order Received"
      : "Stock Partially Received",

    message:
      `${purchaseOrder.poNumber} from ${purchaseOrder.supplierName} was received into stock.`,

    type: "success",

    module: "purchasing",

    link: "/purchasing",

  });

  await logAudit({

    action: "update",

    module: "purchasing",

    entityId: purchaseOrder.id,

    entityName: purchaseOrder.poNumber,

    description:
      `Stock received against ${purchaseOrder.poNumber}.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Delete Purchase Order
|--------------------------------------------------------------------------
*/

export async function deletePurchaseOrder(
  purchaseOrderId: string,
  poNumber: string,
  performedBy: string
): Promise<void> {

  await deleteDoc(
    doc(
      db,
      "purchaseOrders",
      purchaseOrderId
    )
  );

  await logAudit({

    action: "delete",

    module: "purchasing",

    entityId: purchaseOrderId,

    entityName: poNumber,

    description: `Purchase order ${poNumber} was deleted.`,

    performedBy,

  });

}
