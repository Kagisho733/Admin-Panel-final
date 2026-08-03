/*
|--------------------------------------------------------------------------
| Customer Tag Service
|--------------------------------------------------------------------------
| Tags are stored directly on the customer document so they can be read
| together with the customer record without any extra queries.
|--------------------------------------------------------------------------
*/

import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../firebase/config";

import {
  logCustomerActivity,
} from "./customerActivityService";

/*
|--------------------------------------------------------------------------
| Add Customer Tag
|--------------------------------------------------------------------------
*/

export async function addCustomerTag(
  customerId: string,
  tag: string
): Promise<void> {

  const customerRef = doc(
    db,
    "customers",
    customerId
  );

  await updateDoc(customerRef, {

    tags: arrayUnion(tag),

  });

  await logCustomerActivity({

    customerId,

    title: "Customer Tag Added",

    description: `Tag "${tag}" was added to this customer.`,

    type: "customer",

    createdAt: new Date(),

  });

}

/*
|--------------------------------------------------------------------------
| Remove Customer Tag
|--------------------------------------------------------------------------
*/

export async function removeCustomerTag(
  customerId: string,
  tag: string
): Promise<void> {

  const customerRef = doc(
    db,
    "customers",
    customerId
  );

  await updateDoc(customerRef, {

    tags: arrayRemove(tag),

  });

  await logCustomerActivity({

    customerId,

    title: "Customer Tag Removed",

    description: `Tag "${tag}" was removed from this customer.`,

    type: "customer",

    createdAt: new Date(),

  });

}

/*
|--------------------------------------------------------------------------
| Set Customer Tags
|--------------------------------------------------------------------------
*/

export async function setCustomerTags(
  customerId: string,
  tags: string[]
): Promise<void> {

  const customerRef = doc(
    db,
    "customers",
    customerId
  );

  await updateDoc(customerRef, {

    tags,

  });

}
