import {

  collection,

  getDocs,

} from "firebase/firestore";

import { db } from "../firebase/config";

export async function getProductAnalytics() {

  const productsSnapshot = await getDocs(

    collection(db, "products")

  );

  const products = productsSnapshot.docs.map(

    (doc) => doc.data()

  );

  const totalProducts = products.length;


  const activeProducts = products.filter(

  (product) =>

    product.status === "active"

).length;

const lowStockProducts = products.filter(

  (product) =>

    Number(product.stock ?? 0) <= 5

).length;

return {

  totalProducts,

  activeProducts,

  lowStockProducts,

};

}