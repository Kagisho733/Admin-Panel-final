

import ProductForm from "./ProductForm";

import { defaultProduct } from "../../data/defaultProduct";

import type { Product } from "../../types/Product";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  validateProduct,
  hasValidationErrors,
  type ProductErrors,
} from "../../validation/productValidation";




interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  initialProduct?: Product;
}


export default function AddProductModal({
  open,
  onClose,
  onSave,
  initialProduct,
}: Props) {

  const [product, setProduct] =
    useState<Product>(
      initialProduct ?? defaultProduct
    );

  const [errors, setErrors] =
    useState<ProductErrors>({});

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

  if (initialProduct) {

    setProduct(initialProduct);

  } else {

    setProduct(defaultProduct);

  }

  setErrors({});
  setSaving(false);

}, [saving, onClose]);


  useEffect(() => {

  function handleEscape(event: KeyboardEvent) {

    if (event.key === "Escape" && !saving) {

      onClose();

    }

  }

  window.addEventListener("keydown", handleEscape);

  return () => {

    window.removeEventListener(
      "keydown",
      handleEscape
    );

  };



}, [initialProduct]);

  function validateCurrentProduct(
    updatedProduct: Product
  ) {

    const validationErrors =
      validateProduct(updatedProduct);

    setErrors(validationErrors);

  }

  if (!open) return null;

  return (


    <div
  className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
  onClick={!saving ? onClose : undefined}
>

    <div
  onClick={(e) => e.stopPropagation()}
  className="
    bg-white
    rounded-2xl
    shadow-2xl
    w-full
    max-w-5xl
    max-h-[90vh]
    overflow-hidden
    flex
    flex-col
  "
>

     {/* Header */}

<div className="flex items-center justify-between p-8 pb-4 border-b">

  <h2 className="text-3xl font-bold">

    {initialProduct ? "Edit Product" : "Add Product"}

  </h2>

  <button
    onClick={onClose}
    disabled={saving}
    className="
      text-gray-500
      hover:text-red-600
      transition
      disabled:opacity-50
    "
  >
    ✕
  </button>

</div>

        {/* Scrollable Form */}

        <div className="flex-1 overflow-y-auto px-8 py-6">

          <ProductForm
            product={product}
            setProduct={setProduct}
            errors={errors}
            saving={saving}
            validateCurrentProduct={
              validateCurrentProduct
            }
          />
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 p-8 border-t">

          <button
            onClick={onClose}
            disabled={saving}
            className="
    px-6
    py-3
    rounded-xl
    bg-gray-300 
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
          >
            Cancel
          </button>

          <button
            onClick={async () => {

              const validationErrors =
                validateProduct(product);

              setErrors(validationErrors);

              if (hasValidationErrors(validationErrors)) {

                return;

              }

              try {

                setSaving(true);

                await onSave(product);

                toast.success(
                  initialProduct
                    ? "Product updated successfully."
                    : "Product saved successfully."
                );

              } catch (error) {

                console.error(error);

                toast.error(
                  initialProduct
                    ? "Failed to update product."
                    : "Failed to save product."
                );

              } finally {

                setSaving(false);

              }

            }}

            disabled={saving}

            className="
px-6
py-3
rounded-xl
bg-blue-600
text-white
disabled:opacity-50
disabled:cursor-not-allowed
"
          >
            {saving
              ? "Saving..."
              : initialProduct
                ? "Update Product"
                : "Save Product"}
          </button>

        </div>

      </div>

    </div>

  );
}
