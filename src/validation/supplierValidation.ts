import type { Supplier } from "../types/Supplier";

export interface SupplierErrors {

    name?: string;

    contactPerson?: string;

    email?: string;

    phone?: string;

}

export function validateSupplier(
    supplier: Supplier
): SupplierErrors {

    const errors: SupplierErrors = {};

    /*
    |--------------------------------------------------------------------------
    | Supplier Name
    |--------------------------------------------------------------------------
    */

    if (!supplier.name.trim()) {

        errors.name = "Supplier name is required.";

    } else if (supplier.name.trim().length < 2) {

        errors.name =
            "Supplier name must be at least 2 characters.";

    }

    /*
    |--------------------------------------------------------------------------
    | Contact Person
    |--------------------------------------------------------------------------
    */

    if (!supplier.contactPerson.trim()) {

        errors.contactPerson = "Contact person is required.";

    }

    /*
    |--------------------------------------------------------------------------
    | Email
    |--------------------------------------------------------------------------
    */

    if (!supplier.email.trim()) {

        errors.email = "Email is required.";

    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            supplier.email.trim()
        )
    ) {

        errors.email = "Enter a valid email address.";

    }

    /*
    |--------------------------------------------------------------------------
    | Phone
    |--------------------------------------------------------------------------
    */

    if (!supplier.phone.trim()) {

        errors.phone = "Phone number is required.";

    }

    return errors;

}
