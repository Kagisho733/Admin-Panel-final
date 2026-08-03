import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Company } from "../types/Company";

const COMPANY_COLLECTION = "company";
const COMPANY_DOCUMENT = "profile";

const companyRef = doc(
  db,
  COMPANY_COLLECTION,
  COMPANY_DOCUMENT
);

export async function saveCompany(
  company: Company
) {

await setDoc(
  companyRef,
  {
    ...company,
    updatedAt: serverTimestamp(),
  },
  {
    merge: true,
  }
);

}

export async function updateCompany(
  company: Partial<Company>
) {

  await updateDoc(companyRef, {
    ...company,
    updatedAt: serverTimestamp(),
  });

}

export async function getCompany(): Promise<Company | null> {

  const snapshot = await getDoc(companyRef);

  if (!snapshot.exists()) {

    return null;

  }

  return snapshot.data() as Company;

}