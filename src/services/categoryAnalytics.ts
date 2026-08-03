import {

  collection,

  getDocs,

} from "firebase/firestore";

import { db } from "../firebase/config";


export async function getCategoryAnalytics() {

  const categoriesSnapshot = await getDocs(

    collection(db, "categories")

  );

  const categories = categoriesSnapshot.docs.map(

    (doc) => doc.data()

  );

  const totalCategories = categories.length;


  const activeCategories = categories.filter(

  (category) =>

    category.status === "active"

).length;


const inactiveCategories = categories.filter(

  (category) =>

    category.status === "inactive"

).length;

return {

  totalCategories,

  activeCategories,

  inactiveCategories,

};
}

