import type { Product } from "../types/Product";

export interface ProductErrors {

    name?: string;

    description?: string;

    category?: string;

    brand?: string;

    sku?: string;

    barcode?: string;

    price?: string;

    costPrice?: string;

    stock?: string;

    minStock?: string;

    imageUrl?: string;

    status?: string;

}

export function validateProduct(
    product: Product
): ProductErrors {


    
    const errors: ProductErrors = {};

    
    /*
    |--------------------------------------------------------------------------
    | Product Name
    |--------------------------------------------------------------------------
    */

    if (!product.name.trim()) {

        errors.name = "Product name is required.";

    } else if (product.name.trim().length < 3) {

        errors.name =
            "Product name must be at least 3 characters.";

    }

    

    /*
    |--------------------------------------------------------------------------
    | Description
    |--------------------------------------------------------------------------
    */

    if (!product.description.trim()) {

        errors.description =
            "Description is required.";

    } else if (product.description.trim().length < 10) {

        errors.description =
            "Description must contain at least 10 characters.";

    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (!product.category.trim()) {

        errors.category =
            "Please select a category.";

    }

    /*
|--------------------------------------------------------------------------
| Brand
|--------------------------------------------------------------------------
*/

    if (!product.brand.trim()) {

        errors.brand =
            "Brand is required.";

    }

    /*
    |--------------------------------------------------------------------------
    | SKU
    |--------------------------------------------------------------------------
    */

    if (!product.sku.trim()) {

        errors.sku =
            "SKU is required.";

    }

    /*
    |--------------------------------------------------------------------------
    | Barcode
    |--------------------------------------------------------------------------
    */

    if (!product.barcode.trim()) {

        errors.barcode =
            "Barcode is required.";

    }

    /*
    |--------------------------------------------------------------------------
    | Selling Price
    |--------------------------------------------------------------------------
    */

    if (product.price <= 0) {

        errors.price =
            "Selling price must be greater than zero.";

    }

    /*
    |--------------------------------------------------------------------------
    | Cost Price
    |--------------------------------------------------------------------------
    */

    if (product.costPrice < 0) {

        errors.costPrice =
            "Cost price cannot be negative.";

    }

    /*
    |--------------------------------------------------------------------------
    | Stock
    |--------------------------------------------------------------------------
    */

    if (product.stock < 0) {

        errors.stock =
            "Stock cannot be negative.";

    }

    /*
    |--------------------------------------------------------------------------
    | Minimum Stock
    |--------------------------------------------------------------------------
    */

    if (product.minStock < 0) {

        errors.minStock =
            "Minimum stock cannot be negative.";

    }

    /*
|--------------------------------------------------------------------------
| Product Image
|--------------------------------------------------------------------------
*/

    if (!product.imageUrl.trim()) {

        errors.imageUrl =
            "Please upload a product image.";

    }


    /*
|--------------------------------------------------------------------------
| Product Status
|--------------------------------------------------------------------------
*/

    if (!["Active", "Hidden"].includes(product.status)) {

        errors.status =
            "Please select a valid status.";

    }

    /*
|--------------------------------------------------------------------------
| Featured
|--------------------------------------------------------------------------
*/

    if (typeof product.featured !== "boolean") {

        throw new Error(
            "Product.featured must be a boolean."
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Business Rule
    |--------------------------------------------------------------------------
    */

    if (product.costPrice > product.price) {

        errors.costPrice =
            "Cost price should not exceed the selling price.";

    }

    return errors;

}


/*
|--------------------------------------------------------------------------
| Helper Function
|--------------------------------------------------------------------------
*/

export function hasValidationErrors(
  errors: ProductErrors
) {

  return Object.keys(errors).length > 0;

}
