import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export async function updateAdminProfile(
  uid: string,
  data: {
    firstName: string;
    lastName: string;
    phone: string;
  }
) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  });
}