import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Customer } from "../types/Customer";

const customersCollection =
  collection(db, "customers");

  export async function getCustomers(): Promise<Customer[]> {

  const snapshot =
    await getDocs(customersCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Customer, "id">),
  }));

}

/*
|--------------------------------------------------------------------------
| Get Customer By ID
|--------------------------------------------------------------------------
*/

export async function getCustomerById(
  customerId: string
): Promise<Customer | null> {

  const customerRef = doc(
    db,
    "customers",
    customerId
  );

  const snapshot =
    await getDoc(customerRef);

  if (!snapshot.exists()) {

    return null;

  }

  return {

    id: snapshot.id,

    ...(snapshot.data() as Omit<Customer, "id">),

  };

}

/*
|--------------------------------------------------------------------------
| Update Customer
|--------------------------------------------------------------------------
*/

export async function updateCustomer(
  customerId: string,
  customer: Partial<Customer>
): Promise<void> {

  const customerRef = doc(
    db,
    "customers",
    customerId
  );

  await updateDoc(customerRef, customer);

}

/*
|--------------------------------------------------------------------------
| Delete Customer
|--------------------------------------------------------------------------
*/

export async function deleteCustomer(
  customerId: string
): Promise<void> {

  const customerRef = doc(
    db,
    "customers",
    customerId
  );

  await deleteDoc(customerRef);

}

export async function deleteCustomers(
  customerIds: string[]
) {
  await Promise.all(
    customerIds.map(id =>
      deleteCustomer(id)
    )
  );
}