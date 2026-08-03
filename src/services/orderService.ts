import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import { writeBatch } from "firebase/firestore";

import { addDoc } from "firebase/firestore";

import type {
  Order,
  OrderStatus,
} from "../types/Order";

import { logAudit } from "./auditLogService";

const ordersCollection =
  collection(db, "orders");

  /*
|--------------------------------------------------------------------------
| Get All Orders
|--------------------------------------------------------------------------
*/

export async function getOrders(): Promise<Order[]> {

  const snapshot =
    await getDocs(ordersCollection);

  return snapshot.docs.map((doc) => ({

    id: doc.id,

    ...(doc.data() as Omit<Order, "id">),

  }));

}

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
| Used when an order is captured manually from the admin panel.
|--------------------------------------------------------------------------
*/

export async function createOrder(
  order: Order,
  performedBy: string = "Unknown"
): Promise<string> {

  const created = await addDoc(ordersCollection, {

    ...order,

    createdBy: performedBy,

    createdAt: new Date(),

    updatedAt: new Date(),

  });

  await logAudit({

    action: "create",

    module: "orders",

    entityId: created.id,

    entityName: order.customerName,

    description:
      `Order for ${order.customerName} was captured manually.`,

    performedBy,

  });

  return created.id;

}

/*
|--------------------------------------------------------------------------
| Get Order By ID
|--------------------------------------------------------------------------
*/

export async function getOrderById(
  orderId: string
): Promise<Order | null> {

  const orderRef = doc(
    db,
    "orders",
    orderId
  );

  const snapshot =
    await getDoc(orderRef);

  if (!snapshot.exists()) {

    return null;

  }

  return {

    id: snapshot.id,

    ...(snapshot.data() as Omit<Order, "id">),

  };

}

/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  performedBy: string = "Unknown"
): Promise<void> {

  const orderRef = doc(
    db,
    "orders",
    orderId
  );

  await updateDoc(orderRef, {

    status,

  });

  await logAudit({

    action: "status",

    module: "orders",

    entityId: orderId,

    entityName: orderId,

    description: `Order status changed to ${status}.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Delete Order
|--------------------------------------------------------------------------
*/

export async function deleteOrder(
  orderId: string,
  performedBy: string = "Unknown"
): Promise<void> {

  const orderRef = doc(
    db,
    "orders",
    orderId
  );

  await deleteDoc(orderRef);

  await logAudit({

    action: "delete",

    module: "orders",

    entityId: orderId,

    entityName: orderId,

    description: `Order ${orderId} was deleted.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Bulk Delete Orders
|--------------------------------------------------------------------------
*/

export async function deleteOrders(
  orderIds: string[],
  performedBy: string = "Unknown"
): Promise<void> {

  const batch = writeBatch(db);

  orderIds.forEach((orderId) => {

    const orderRef = doc(
      db,
      "orders",
      orderId
    );

    batch.delete(orderRef);

  });

  await batch.commit();

  await logAudit({

    action: "delete",

    module: "orders",

    entityId: orderIds.join(", "),

    entityName: `${orderIds.length} order(s)`,

    description: `${orderIds.length} order(s) were deleted in bulk.`,

    performedBy,

  });

}


/*
|--------------------------------------------------------------------------
| Bulk Update Order Status
|--------------------------------------------------------------------------
*/

export async function updateOrdersStatus(
  orderIds: string[],
  status: OrderStatus,
  performedBy: string = "Unknown"
): Promise<void> {

  const batch = writeBatch(db);

  orderIds.forEach((orderId) => {

    const orderRef = doc(
      db,
      "orders",
      orderId
    );

    batch.update(orderRef, {
      status,
    });

  });

  await batch.commit();

  await logAudit({

    action: "status",

    module: "orders",

    entityId: orderIds.join(", "),

    entityName: `${orderIds.length} order(s)`,

    description:
      `${orderIds.length} order(s) were set to ${status} in bulk.`,

    performedBy,

  });

}