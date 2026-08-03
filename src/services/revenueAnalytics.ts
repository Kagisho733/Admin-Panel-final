import {

  collection,

  getDocs,

} from "firebase/firestore";

import { db } from "../firebase/config";


export async function getRevenueAnalytics() {

  const ordersSnapshot = await getDocs(

    collection(db, "orders")

  );

  const orders = ordersSnapshot.docs.map(

    (doc) => doc.data()

  );

  const totalRevenue = orders.reduce(

  (sum, order) =>

    sum + Number(order.total ?? 0),

  0

);

const monthlyRevenue = totalRevenue;


return {

  totalRevenue,

  monthlyRevenue,

};

}

