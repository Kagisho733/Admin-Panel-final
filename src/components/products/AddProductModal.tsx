import { useEffect, useState } from "react";
import { FaBoxOpen, FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { defaultProduct } from "../../data/defaultProduct";
import type { Product } from "../../types/Product";
import { hasValidationErrors, validateProduct, type ProductErrors } from "../../validation/productValidation";
import ProductForm from "./ProductForm";

interface Props { open: boolean; onClose: () => void; onSave: (product: Product) => Promise<void>; initialProduct?: Product; }

export default function AddProductModal({open, onClose, onSave, initialProduct}: Props) {
  const [product, setProduct] = useState<Product>(initialProduct ?? defaultProduct);
  const [errors, setErrors] = useState<ProductErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setProduct(initialProduct ?? {...defaultProduct, createdAt: new Date(), updatedAt: new Date()}); setErrors({}); setSaving(false); }, [initialProduct, open]);
  useEffect(() => { const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && !saving) onClose(); }; window.addEventListener("keydown", escape); return () => window.removeEventListener("keydown", escape); }, [onClose, saving]);
  if (!open) return null;

  const submit = async () => {
    const validationErrors = validateProduct(product); setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) { toast.error("Please correct the highlighted product details."); return; }
    try { setSaving(true); await onSave(product); toast.success(initialProduct ? "Product updated." : "Product created."); }
    catch (reason) { console.error(reason); toast.error(initialProduct ? "Product could not be updated." : "Product could not be created."); }
    finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => {if (event.target === event.currentTarget && !saving) onClose();}}>
    <div role="dialog" aria-modal="true" aria-labelledby="product-modal-title" className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
      <header className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-950 to-blue-950 px-5 py-5 text-white sm:px-8">
        <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/20 text-cyan-300"><FaBoxOpen size={21}/></span><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Catalogue management</p><h2 id="product-modal-title" className="text-2xl font-black">{initialProduct ? "Edit product" : "Add a new product"}</h2><p className="mt-1 text-sm text-slate-300">Fields marked with * are required.</p></div></div>
        <button onClick={onClose} disabled={saving} className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50" aria-label="Close product form"><FaTimes/></button>
      </header>
      <div className="flex-1 overflow-y-auto bg-slate-50/70 px-5 py-6 sm:px-8"><ProductForm product={product} setProduct={setProduct} errors={errors} saving={saving} validateCurrentProduct={(value) => setErrors(validateProduct(value))}/></div>
      <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"><p className="text-xs text-slate-500">Review pricing, inventory and visibility before saving.</p><div className="flex gap-3"><button onClick={onClose} disabled={saving} className="rounded-xl border border-slate-300 px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button><button onClick={() => void submit()} disabled={saving} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"><FaCheck/>{saving ? "Saving product..." : initialProduct ? "Save changes" : "Create product"}</button></div></footer>
    </div>
  </div>;
}
