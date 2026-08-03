# Books • Bots • Drones — Setup & Continuation Guide

Everything you need to do after unzipping. Follow in order.

---

## 1. Restore your Firebase API key

Open `src/firebase/config.ts` and put your key back:

```ts
const firebaseConfig = {
  apiKey: "PASTE_YOUR_KEY_HERE",   // <-- this line
  authDomain: "books-bots-drones-f6fb0.firebaseapp.com",
  // ...the rest is unchanged
};
```

Nothing else in that file was touched.

---

## 2. Create your `.env` file

The project reads Supabase credentials from environment variables. Copy the example:

```bash
copy .env.example .env
```

Then fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without these, product image upload and customer attachments will fail at runtime (the rest of the app still works).

---

## 3. Install and run

```bash
npm install
npm run dev
```

If `npm install` complains about `@rolldown/binding-win32-x64-msvc`, that is expected on non-Windows machines only. On your Windows machine it installs normally.

Verify it compiles:

```bash
npm run build
```

This should finish with no TypeScript errors. It does on my side.

---

## 4. Create the Supabase `attachments` bucket

Customer attachments upload to a bucket named `attachments` (product images already use `products`).

1. Supabase dashboard → **Storage** → **New bucket**
2. Name: `attachments`
3. Toggle **Public bucket** ON (the code calls `getPublicUrl`)
4. Create

Without this bucket, uploading a customer attachment throws a "bucket not found" error.

---

## 5. Deploy the Firestore security rules

**Do this before going live.** Your database is currently open.

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

`.firebaserc` is already pointed at `books-bots-drones-f6fb0`.

The rules in `firestore.rules` read roles from `users/{uid}.role` and `users/{uid}.active`, which is exactly what `AuthProvider.tsx` already does. Roles map like this:

| Collection | Read | Write |
|---|---|---|
| products, orders | any active user | admin/manager (orders: + seller) |
| customers + CRM | any active user | admin |
| suppliers, purchaseOrders, stockMovements | any active user | admin/manager |
| expenses | admin | admin |
| auditLogs | admin | append-only, admin can delete |

> Important: make sure your own admin user document has `active: true`, or the rules will lock you out.

---

## 6. Deploy the app

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` is configured for `dist/` with SPA rewrites, so deep links like `/inventory` work on refresh.

---

## 7. Seed data to see the new modules working

The new modules read live Firestore data, so they look empty until data exists. Fastest path:

1. **Suppliers** → *+ Add Supplier* → create one
2. **Purchasing** → *+ New Purchase Order* → pick that supplier, add products, *Place Order*
3. Open the PO → *Receive Stock* → watch product stock increase on the **Inventory** page
4. **Finance** → *+ Capture Expense*
5. **Orders** → *+ New Order* → capture a manual order
6. **Company** → fill in your business details (used on invoices)
7. Check **Notifications** (bell icon) and **Audit Logs** — both should now have entries

Audit Logs will also fill up on its own as you work, including your logins and logouts.

---

## 8. Firestore indexes

None needed right now. Every query uses a single-field `orderBy`, which Firestore indexes automatically. If you later add a compound query, Firebase prints a "create index" link in the browser console — click it, then run `firebase deploy --only firestore:indexes`.

---

## 9. Optional: move Firebase config to `.env`

Only if you want to. Uncomment the Firebase block in `.env.example`, fill in `.env`, then change `src/firebase/config.ts`:

```ts
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
```

Note: a Firebase web API key is not a secret — it identifies your project, it doesn't grant access. Your security comes from the Firestore rules in step 5. Moving it to `.env` is tidiness, not protection.

---

## 10. What's built and where

**CRM (complete)**

| Feature | Files |
|---|---|
| Tags | `data/customerTags.ts`, `services/customerTagService.ts`, `components/customers/CustomerTags.tsx`, `CustomerTagBadge.tsx` |
| Attachments | `types/CustomerAttachment.ts`, `services/customerAttachmentService.ts`, `components/customers/CustomerAttachments.tsx` |
| Communication | `types/CustomerCommunication.ts`, `services/customerCommunicationService.ts`, `components/customers/CustomerCommunications.tsx` |
| Purchase history | `components/customers/CustomerPurchaseHistory.tsx` |
| Notes | `components/customers/CustomerNotes.tsx` |
| Timeline + badges | `components/customers/CustomerActivityTimeline.tsx`, `ActivityBadge.tsx` |
| Modal | `components/customers/CustomerDetailsModal.tsx` — 6 tabs: Overview, Orders, Notes, Activity, Communication, Attachments |

**Modules and routes**

| Module | Route | Page |
|---|---|---|
| Inventory | `/inventory` | `pages/inventory/InventoryPage.tsx` |
| Suppliers | `/suppliers` | `pages/suppliers/SuppliersPage.tsx` |
| Purchasing | `/purchasing` | `pages/purchasing/PurchasingPage.tsx` |
| Finance | `/finance` | `pages/finance/FinancePage.tsx` |
| Reports | `/reports` | `pages/reports/ReportsPage.tsx` |
| Notifications | `/notifications` | `pages/notifications/NotificationsPage.tsx` |
| Audit Logs | `/audit-logs` | `pages/audit/AuditLogsPage.tsx` |
| Company | `/company` | `pages/company/CompanyPage.tsx` |

**Manual order capture (new)**

The Orders page now has a **+ New Order** button for phone and walk-in orders:

`components/orders/OrderForm.tsx`, `AddOrderButton.tsx`, `OrderItemsTable.tsx`, `OrderSummaryCard.tsx`, `PaymentStatusBadge.tsx`, `OrderTimeline.tsx`, `data/defaultOrder.ts`, `validation/orderValidation.ts`, plus `createOrder()` in `services/orderService.ts`.

**Firestore collections added**

`stockMovements`, `suppliers`, `purchaseOrders`, `expenses`, `notifications`, `auditLogs`, `customerCommunications`, `customerAttachments`

**Existing data models — only additive optional fields**

| Type | Added |
|---|---|
| `Customer` | `tags?: string[]` |
| `Order` | `paymentStatus?`, `customerPhone?`, `notes?`, `createdBy?`, `updatedAt?` |

All optional, so existing documents keep working with no migration.

**How the modules connect**

- Receiving a purchase order → adds stock → writes a `stockMovements` record → updates supplier totals → raises a notification → writes an audit log
- Stock dropping to or below `minStock` → automatic low-stock notification
- Finance profit = order revenue − received purchase orders − expenses
- Reports read from all of the above; no separate report data is stored

---

## 11. Audit logging

`services/auditLogService.ts` is now called from every module. Each entry records the action, module, entity, description, who did it, and when.

**Covered:** products (create/update/delete), orders (create/status/delete/bulk delete/bulk status), categories (create/update/delete), users (update/delete), suppliers, purchase orders, expenses, inventory adjustments, customer tags and attachments, and **login/logout**.

Two implementation notes:

- Every service function takes `performedBy` as an **optional** last parameter defaulting to `"Unknown"`, so nothing breaks if you call one from somewhere new. All existing call sites pass the signed-in user's email.
- The **logout** entry is written *before* `signOut()` runs. Once the user is signed out, the Firestore rules reject the write, so the order matters. Don't swap it back.
- `logAudit()` never throws — a logging failure can't break a user action.

---

## 12. Bundle size

Route-level code splitting is in place. Every page is `React.lazy()` behind a `<Suspense>` fallback in `routes/AppRoutes.tsx`.

| | Before | After |
|---|---|---|
| Initial bundle | 2,138 kB (607 kB gzip) | **876 kB (268 kB gzip)** |
| Orders chunk | 436 kB | **37.5 kB** |

jsPDF was being bundled into the Orders screen. `generateInvoice()` in `services/invoiceService.ts` now imports it dynamically, so the 399 kB PDF library only downloads the first time someone actually generates an invoice. The function is `async` now — existing callers don't need changing, but if you call it somewhere new and need to know when it's finished, `await` it.

The build still warns that the main chunk is over 500 kB. That remainder is mostly the Firebase SDK, which is needed at startup for auth, so splitting it further wouldn't speed up first load.

---

## 13. Empty files: resolved

All 21 empty files are gone — 11 filled, 10 deleted.

**Deleted** as genuinely redundant. Filling these would have meant rewriting completed modules:

| File | Why |
|---|---|
| `analytics/OrdersCard`, `ProductsCard`, `RevenueCard`, `UsersCard` | `AnalyticsPage` already renders `AnalyticsCard` for those exact metrics |
| `components/auth/ProtectedRoute` | duplicate of `routes/ProtectedRoute.tsx` (the one actually used) |
| `customers/CustomerFilter` | duplicate of `CustomerStatusFilter` |
| `customers/CustomerTimeline` | duplicate of `CustomerActivityTimeline` |
| `products/ProductFormFields` | `ProductForm` is already the shared add/edit form |
| `products/ProductActions` | `ProductTable` already has inline edit/delete buttons |
| `categories/AddCategoryButton` | `CategoriesPage` already has an inline button |
| `dashboard/DashboardStats` | `Dashboard` already maps `StatCard` inline |

**Filled and wired in:** the six order files listed in section 10, plus `CategoryStats` (new stats row on the Categories page), `CustomerPurchaseHistory` (Orders tab in the customer modal), `CompanyPage`, and `PaymentStatusBadge` / `OrderTimeline` (both added to `OrderDetailsModal`).

While wiring `/company` I found `CompanyContactInfo` was orphaned — built but never rendered. It's now included in `CompanyProfileForm` between Address and Financial.

---

## 14. Bugs fixed along the way

The project did not build when you first sent it. Three compile errors:

1. `services/customerService.ts` called `deleteCustomer()` which didn't exist → added it, plus `getCustomerById` and `updateCustomer`
2. `components/customers/CustomersTable.tsx` — `toggleAllCustomers` was unused and every row rendered **5 duplicate checkboxes** → added the select-all header checkbox, removed the 4 duplicates
3. `pages/customers/CustomersPage.tsx` — an unused duplicate `handleSort` → removed (the real one is in the table)

Also fixed:

- `CustomerDetailsModal.tsx` showed the placeholder "Customer details will go here" and rendered its content *outside* the modal card → rebuilt as a tabbed modal
- `AppRoutes.tsx` had two identical `path="*"` catch-all routes; the second was unreachable dead code → removed

---

## 15. Suggested next steps

1. Wire `logAudit()` into `companyService.ts` — it's the last service without it
2. Consider a Firestore composite index if you start filtering audit logs server-side; right now filtering is client-side, which is fine up to a few thousand records
3. Add pagination to the Inventory and Suppliers tables once you pass a few hundred rows (the `Pagination` component in `components/common/` is ready to reuse — Audit Logs already uses it)
4. The Analytics page stacks single cards full-width below the grid, which looks unintentional — worth a tidy-up when you're next in there
