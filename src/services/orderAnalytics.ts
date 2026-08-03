import {

  collection,

  getDocs,

} from "firebase/firestore";

import { db } from "../firebase/config";

export async function getOrderAnalytics() {

  const ordersSnapshot = await getDocs(

    collection(db, "orders")

  );

  const orders = ordersSnapshot.docs.map(

    (doc) => doc.data()

  );

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(

  (order) =>

    order.status === "pending"

).length;

const completedOrders = orders.filter(

  (order) =>

    order.status === "completed"

).length;

const monthlyOrders = totalOrders;

return {

  totalOrders,

  pendingOrders,

  completedOrders,

  monthlyOrders,

};

}