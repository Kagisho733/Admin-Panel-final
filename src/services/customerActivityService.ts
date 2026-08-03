import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { CustomerActivity }
from "../types/CustomerActivity";



const activityCollection = collection(
  db,
  "customerActivities"
);

export async function getCustomerActivities(
  customerId: string
): Promise<CustomerActivity[]> {

  const q = query(
    activityCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<CustomerActivity, "id">),
    }))
    .filter(
      activity =>
        activity.customerId === customerId
    );

}

export async function addCustomerActivity(
  activity: Omit<CustomerActivity, "id">
) {

  await addDoc(
    activityCollection,
    activity
  );

}

export async function logCustomerActivity(

  activity: Omit<CustomerActivity, "id">

) {

  await addDoc(

    collection(db, "customerActivities"),

    activity

  );

}