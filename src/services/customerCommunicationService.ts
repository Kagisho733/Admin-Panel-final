/*
|--------------------------------------------------------------------------
| Customer Communication Service
|--------------------------------------------------------------------------
| Stores the full communication history for a customer.
|--------------------------------------------------------------------------
*/

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { CustomerCommunication }
from "../types/CustomerCommunication";

import {
  logCustomerActivity,
} from "./customerActivityService";

const communicationsCollection = collection(
  db,
  "customerCommunications"
);

/*
|--------------------------------------------------------------------------
| Get Customer Communications
|--------------------------------------------------------------------------
*/

export async function getCustomerCommunications(
  customerId: string
): Promise<CustomerCommunication[]> {

  const q = query(
    communicationsCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<CustomerCommunication, "id">),
    }))
    .filter(
      communication =>
        communication.customerId === customerId
    );

}

/*
|--------------------------------------------------------------------------
| Add Customer Communication
|--------------------------------------------------------------------------
*/

export async function addCustomerCommunication(
  communication: Omit<CustomerCommunication, "id">
): Promise<void> {

  await addDoc(
    communicationsCollection,
    communication
  );

  await logCustomerActivity({

    customerId: communication.customerId,

    title: "Communication Logged",

    description:
      `${communication.channel.toUpperCase()} • ${communication.subject}`,

    type: "email",

    createdAt: new Date(),

  });

}

/*
|--------------------------------------------------------------------------
| Delete Customer Communication
|--------------------------------------------------------------------------
*/

export async function deleteCustomerCommunication(
  communicationId: string
): Promise<void> {

  await deleteDoc(
    doc(
      db,
      "customerCommunications",
      communicationId
    )
  );

}
