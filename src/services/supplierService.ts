/*
|--------------------------------------------------------------------------
| Supplier Service
|--------------------------------------------------------------------------
| Handles every Firestore operation related to suppliers.
|--------------------------------------------------------------------------
*/

import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/config";

import type { Supplier } from "../types/Supplier";

import { logAudit } from "./auditLogService";

const suppliersCollection = collection(db, "suppliers");

/*
|--------------------------------------------------------------------------
| Get All Suppliers
|--------------------------------------------------------------------------
*/

export async function getSuppliers(): Promise<Supplier[]> {

  const snapshot = await getDocs(suppliersCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Supplier, "id">),
  }));

}

/*
|--------------------------------------------------------------------------
| Get Supplier By ID
|--------------------------------------------------------------------------
*/

export async function getSupplierById(
  supplierId: string
): Promise<Supplier | null> {

  const supplierRef = doc(
    db,
    "suppliers",
    supplierId
  );

  const snapshot = await getDoc(supplierRef);

  if (!snapshot.exists()) {

    return null;

  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Supplier, "id">),
  };

}

/*
|--------------------------------------------------------------------------
| Create Supplier
|--------------------------------------------------------------------------
*/

export async function createSupplier(
  supplier: Supplier,
  performedBy: string
): Promise<string> {

  const created = await addDoc(suppliersCollection, {

    ...supplier,

    createdAt: new Date(),

    updatedAt: new Date(),

  });

  await logAudit({

    action: "create",

    module: "suppliers",

    entityId: created.id,

    entityName: supplier.name,

    description: `Supplier "${supplier.name}" was created.`,

    performedBy,

  });

  return created.id;

}

/*
|--------------------------------------------------------------------------
| Update Supplier
|--------------------------------------------------------------------------
*/

export async function updateSupplier(
  supplierId: string,
  supplier: Partial<Supplier>,
  performedBy: string
): Promise<void> {

  const supplierRef = doc(
    db,
    "suppliers",
    supplierId
  );

  await updateDoc(supplierRef, {

    ...supplier,

    updatedAt: new Date(),

  });

  await logAudit({

    action: "update",

    module: "suppliers",

    entityId: supplierId,

    entityName: supplier.name ?? "",

    description: `Supplier "${supplier.name ?? supplierId}" was updated.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Delete Supplier
|--------------------------------------------------------------------------
*/

export async function deleteSupplier(
  supplierId: string,
  supplierName: string,
  performedBy: string
): Promise<void> {

  const supplierRef = doc(
    db,
    "suppliers",
    supplierId
  );

  await deleteDoc(supplierRef);

  await logAudit({

    action: "delete",

    module: "suppliers",

    entityId: supplierId,

    entityName: supplierName,

    description: `Supplier "${supplierName}" was deleted.`,

    performedBy,

  });

}

/*
|--------------------------------------------------------------------------
| Export Suppliers CSV
|--------------------------------------------------------------------------
*/

export function exportSuppliersCSV(
  suppliers: Supplier[],
  filename = `suppliers-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`
) {

  const headers = [
    "Supplier",
    "Contact Person",
    "Email",
    "Phone",
    "City",
    "Payment Terms",
    "Status",
    "Total Spent",
  ];

  const rows = suppliers.map((supplier) => [
    escapeCSV(supplier.name),
    escapeCSV(supplier.contactPerson),
    escapeCSV(supplier.email),
    escapeCSV(supplier.phone),
    escapeCSV(supplier.city),
    escapeCSV(supplier.paymentTerms),
    escapeCSV(supplier.status),
    (supplier.totalSpent ?? 0).toFixed(2),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob(
    [csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

}

function escapeCSV(value: string) {
  return `"${String(value).replace(/"/g, '""')}"`;
}
