import {

  collection,

  getDocs,

} from "firebase/firestore";

import { db } from "../firebase/config";

export async function getUserAnalytics() {

  const usersSnapshot = await getDocs(

    collection(db, "users")

  );

  const users = usersSnapshot.docs.map(

    (doc) => doc.data()

  );

  const totalUsers = users.length;

  const adminUsers = users.filter(

  (user) =>

    user.role === "admin"

).length;

const customerUsers = users.filter(

  (user) =>

    user.role === "customer"

).length;

return {

  totalUsers,

  adminUsers,

  customerUsers,

};
}

