import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Category } from "../types/Category";

import { logAudit } from "./auditLogService";

const categoriesCollection =
  collection(db, "categories");

  /*
|--------------------------------------------------------------------------
| Get All Categories
|--------------------------------------------------------------------------
*/

export async function getCategories(): Promise<Category[]> {

  const snapshot =
    await getDocs(categoriesCollection);

  return snapshot.docs.map((doc) => ({

    id: doc.id,

    ...(doc.data() as Omit<Category, "id">),

  }));

}

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export async function createCategory(

  category: Omit<Category, "id">,

  performedBy: string = "Unknown"

): Promise<void> {

  const created = await addDoc(

    categoriesCollection,

    category

  );

  await logAudit({

    action: "create",

    module: "categories",

    entityId: created.id,

    entityName: category.name ?? "",

    description: `Category "${category.name ?? ""}" was created.`,

    performedBy,

  });

}



/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export async function updateCategory(

  categoryId: string,

  category: Omit<Category, "id">,

  performedBy: string = "Unknown"

): Promise<void> {

  const categoryRef = doc(

    db,

    "categories",

    categoryId

  );

  await updateDoc(

    categoryRef,

    category

  );

  await logAudit({

    action: "update",

    module: "categories",

    entityId: categoryId,

    entityName: category.name ?? "",

    description: `Category "${category.name ?? categoryId}" was updated.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
*/

export async function deleteCategory(

  categoryId: string,

  performedBy: string = "Unknown",

  categoryName: string = ""

): Promise<void> {

  const categoryRef = doc(

    db,

    "categories",

    categoryId

  );

  await deleteDoc(categoryRef);

  await logAudit({

    action: "delete",

    module: "categories",

    entityId: categoryId,

    entityName: categoryName,

    description: `Category "${categoryName || categoryId}" was deleted.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Get Category By ID
|--------------------------------------------------------------------------
*/

export async function getCategoryById(
  categoryId: string
): Promise<Category | null> {

  const categoryRef = doc(
    db,
    "categories",
    categoryId
  );

  const snapshot =
    await getDoc(categoryRef);

  if (!snapshot.exists()) {

    return null;

  }

  return {

    id: snapshot.id,

    ...(snapshot.data() as Omit<Category, "id">),

  };

}