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

import type { CustomerNote } from "../types/CustomerNote";

import {
  logCustomerActivity,
} from "./customerActivityService";

const notesCollection = collection(
  db,
  "customerNotes"
);

export async function getCustomerNotes(
  customerId: string
): Promise<CustomerNote[]> {

  const q = query(
    notesCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<CustomerNote, "id">),
    }))
    .filter(note => note.customerId === customerId);

}

export async function addCustomerNote(
  note: Omit<CustomerNote, "id">
) {

  await addDoc(
    notesCollection,
    note
  );

  await logCustomerActivity({

    customerId: note.customerId,

    title: "Customer Note Added",

    description: note.note,

    type: "note",

    createdAt: new Date(),

  });

}



export async function deleteCustomerNote(
  id: string
) {

  await deleteDoc(
    doc(
      db,
      "customerNotes",
      id
    )
  );

}