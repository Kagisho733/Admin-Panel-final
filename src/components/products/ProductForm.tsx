/*
|--------------------------------------------------------------------------
| Product Form
|--------------------------------------------------------------------------
| Shared form used by:
| • Add Product
| • Edit Product
|--------------------------------------------------------------------------
*/

import type { Product } from "../../types/Product";
import ImageUploader from "./ImageUploader";
import type { ProductErrors } from "../../validation/productValidation";


interface Props {

    product: Product;

    setProduct: React.Dispatch<
        React.SetStateAction<Product>
    >;

    errors: ProductErrors;

    saving: boolean;

    validateCurrentProduct: (
        product: Product
    ) => void;

}

export default function ProductForm({

    product,

    setProduct,

    errors,

    saving,
    validateCurrentProduct,

}: Props) {


    function updateProduct(
        changes: Partial<Product>
    ) {

        const updatedProduct = {

            ...product,

            ...changes,

        };

        setProduct(updatedProduct);

        validateCurrentProduct(updatedProduct);

    }
    return (

        <div className="space-y-10 pb-8">

            {/* Product Information */}

            <section>

                <h3 className="text-xl font-bold mb-4">

                    Product Information

                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div>

                        <label className="font-medium">

                            Product Name

                        </label>

                        <input
                            type="text"
                            value={product.name}
                            disabled={saving}
                            onChange={(e) =>
                                updateProduct({
                                    name: e.target.value,
                                })
                            }
                            className={`w-full mt-2 rounded-xl p-3 border ${errors.name
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}

                        />
                        {errors.name && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.name}

                            </p>

                        )}
                    </div>

                    <div>

                        <label className="font-medium">

                            Description

                        </label>

                        <textarea
                            disabled={saving}
                            rows={4}
                            value={product.description}
                            onChange={(e) =>
                                updateProduct({
                                    description: e.target.value,
                                })
                            }
                            className={`w-full mt-2 rounded-xl p-3 border ${errors.description
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                        />
                        {errors.description && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.description}

                            </p>

                        )}
                    </div>


                    <div>

                        <label className="font-medium">

                            Category

                        </label>

                        <select
                            disabled={saving}
                            value={product.category}

                            onChange={(e) =>
                                updateProduct({
                                    category: e.target.value,
                                })
                            }
                            className={`w-full mt-2 rounded-xl p-3 border ${errors.category
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}

                        >



                            <option value="">

                                Select Category

                            </option>

                            <option>

                                Books

                            </option>

                            <option>

                                Bots

                            </option>

                            <option>

                                Drones

                            </option>

                        </select>
                        {errors.category && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.category}

                            </p>

                        )}
                    </div>


                    <div>

                        <label className="font-medium">

                            Brand

                        </label>

                        <input
                            disabled={saving}
                            value={product.brand}

                            onChange={(e) =>
                                updateProduct({
                                    brand: e.target.value,
                                })
                            }

                            className={`w-full mt-2 rounded-xl p-3 border ${errors.brand
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}

                        />
                        {errors.brand && (

                            <p className="mt-2 text-sm text-red-600">

                                {errors.brand}

                            </p>

                        )}
                    </div>
                </div>

            </section>

            <section>

                <h3 className="text-xl font-bold mb-4">
                    Pricing
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div>

                        <label
                            htmlFor="price"
                            className="font-medium"
                        >
                            Selling Price
                        </label>

                        <input
                            disabled={saving}
                            id="price"
                            name="price"
                            type="number"
                            value={product.price}
                            onChange={(e) =>
                                updateProduct({
                                    price: Number(e.target.value),
                                })
                            }
                            className={`w-full mt-2 rounded-xl p-3 border ${errors.price
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                        />
                        {errors.price && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    <div>

                        <label
                            htmlFor="costPrice"
                            className="font-medium"
                        >
                            Cost Price
                        </label>

                        <input
                            disabled={saving}
                            id="costPrice"
                            name="costPrice"
                            type="number"
                            value={product.costPrice}
                            onChange={(e) =>
                                updateProduct({
                                    costPrice: Number(e.target.value),
                                })
                            }
                            className={`w-full mt-2 rounded-xl p-3 border ${errors.costPrice
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                        />
                        {errors.costPrice && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.costPrice}
                            </p>
                        )}
                    </div>

                </div>

            </section>


            <section>

                <h3 className="text-xl font-bold mb-4">

                    Inventory

                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div>

                        <label
                            htmlFor="stock"
                            className="font-medium"
                        >
                            Stock Quantity
                        </label>

                        <input
                            disabled={saving}
                            id="stock"
                            name="stock"
                            type="number"
                            value={product.stock}
                            onChange={(e) =>
                                updateProduct({
                                    stock: Number(e.target.value),
                                })
                            }
                            className={`w-full mt-2 rounded-xl p-3 border ${errors.stock
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                        />
                        {errors.stock && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.stock}
                            </p>
                        )}
                    </div>

                    <div>

                        <label
                            htmlFor="minStock"
                            className="font-medium"
                        >
                            Minimum Stock
                        </label>

                        <input
                            disabled={saving}
                            id="minStock"
                            name="minStock"
                            type="number"
                            value={product.minStock}
                            onChange={(e) =>
                                updateProduct({
                                    minStock: Number(e.target.value),
                                })
                            }
                            className={`w-full mt-2 rounded-xl p-3 border ${errors.minStock
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                        />
                        {errors.minStock && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.minStock}
                            </p>
                        )}
                    </div>

                    <div>

                        <label
                            htmlFor="sku"
                            className="font-medium"
                        >
                            SKU
                        </label>

                        <input
                            disabled={saving}
                            id="sku"
                            name="sku"
                            type="text"
                            value={product.sku}
                            onChange={(e) =>
                                updateProduct({
                                    sku: e.target.value,
                                })
                            }
                            className="w-full mt-2 border rounded-xl p-3"
                        />

                    </div>

                    <div>

                        <label
                            htmlFor="barcode"
                            className="font-medium"
                        >
                            Barcode
                        </label>

                        <input
                            disabled={saving}
                            id="barcode"
                            name="barcode"
                            type="text"
                            value={product.barcode}
                            onChange={(e) =>
                                updateProduct({
                                    barcode: e.target.value,
                                })
                            }
                            className="w-full mt-2 border rounded-xl p-3"
                        />

                    </div>

                </div>

            </section>



            <section>

                <h3 className="text-xl font-bold mb-4">

                    Product Settings

                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div>

                        <label
                            htmlFor="status"
                            className="font-medium"
                        >
                            Status
                        </label>

                        <select
                            disabled={saving}

                            id="status"

                            name="status"

                            value={product.status}

                            onChange={(e) =>
                                updateProduct({
                                    status: e.target.value as
                                        "Active" | "Hidden",
                                })
                            }

                            className="w-full mt-2 border rounded-xl p-3"

                        >

                            <option value="Active">

                                Active

                            </option>

                            <option value="Hidden">

                                Hidden

                            </option>

                        </select>

                    </div>

                    <div>

                        <label
                            htmlFor="featured"
                            className="font-medium block mb-3"
                        >

                            Featured Product

                        </label>

                        <label className="flex items-center gap-3">

                            <input

                                id="featured"

                                name="featured"

                                type="checkbox"
                                disabled={saving}
                                checked={product.featured}

                                onChange={(e) =>
                                    updateProduct({
                                        featured: e.target.checked,
                                    })
                                }

                            />

                            <span>

                                Display on homepage

                            </span>

                        </label>

                    </div>

                </div>

            </section>

            <section>

                <h3 className="text-xl font-bold mb-4">

                    Product Image

                </h3>

                <div>

                    <ImageUploader
                        imageUrl={product.imageUrl}
                        onImageUploaded={(url: string) =>
                            updateProduct({
                                imageUrl: url,
                            })
                        }
                        disabled={saving}
                    />

                </div>

            </section>
        </div>

    );

}