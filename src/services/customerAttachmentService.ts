/*
|--------------------------------------------------------------------------
| Customer Attachment Service
|--------------------------------------------------------------------------
| Files are uploaded to Supabase Storage (same approach as imageService)
| while the metadata is stored in Firestore so it can be queried with the
| rest of the CRM data.
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

import { supabase } from "../supabase/supabase";

import type { CustomerAttachment }
from "../types/CustomerAttachment";

import {
  logCustomerActivity,
} from "./customerActivityService";

const attachmentsCollection = collection(
  db,
  "customerAttachments"
);

const attachmentsBucket = "attachments";

/*
|--------------------------------------------------------------------------
| Get Customer Attachments
|--------------------------------------------------------------------------
*/

export async function getCustomerAttachments(
  customerId: string
): Promise<CustomerAttachment[]> {

  const q = query(
    attachmentsCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<CustomerAttachment, "id">),
    }))
    .filter(
      attachment =>
        attachment.customerId === customerId
    );

}

/*
|--------------------------------------------------------------------------
| Upload Customer Attachment
|--------------------------------------------------------------------------
*/

export async function uploadCustomerAttachment(
  customerId: string,
  file: File,
  uploadedBy: string
): Promise<void> {

  const fileName =
    `${customerId}/${Date.now()}-${file.name}`;

  const result = await supabase.storage
    .from(attachmentsBucket)
    .upload(fileName, file);

  if (result.error) {

    throw result.error;

  }

  const { data } = supabase.storage
    .from(attachmentsBucket)
    .getPublicUrl(fileName);

  await addDoc(attachmentsCollection, {

    customerId,

    fileName: file.name,

    fileUrl: data.publicUrl,

    fileType: file.type,

    fileSize: file.size,

    uploadedBy,

    createdAt: new Date(),

  });

  await logCustomerActivity({

    customerId,

    title: "Attachment Uploaded",

    description: `File "${file.name}" was attached to this customer.`,

    type: "customer",

    createdAt: new Date(),

  });

}

/*
|--------------------------------------------------------------------------
| Delete Customer Attachment
|--------------------------------------------------------------------------
*/

export async function deleteCustomerAttachment(
  attachmentId: string
): Promise<void> {

  await deleteDoc(
    doc(
      db,
      "customerAttachments",
      attachmentId
    )
  );

}
