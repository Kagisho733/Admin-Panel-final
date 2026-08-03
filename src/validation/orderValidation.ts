import type { Order } from "../types/Order";

export interface OrderErrors {

    customerName?: string;

    customerEmail?: string;

    customerPhone?: string;

    items?: string;

}

export function validateOrder(
    order: Order
): OrderErrors {

    const errors: OrderErrors = {};

    /*
    |--------------------------------------------------------------------------
    | Customer Name
    |--------------------------------------------------------------------------
    */

    if (!order.customerName.trim()) {

        errors.customerName = "Customer name is required.";

    } else if (order.customerName.trim().length < 2) {

        errors.customerName =
            "Customer name must be at least 2 characters.";

    }

    /*
    |--------------------------------------------------------------------------
    | Customer Email
    |--------------------------------------------------------------------------
    */

    if (!order.customerEmail.trim()) {

        errors.customerEmail = "Customer email is required.";

    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            order.customerEmail.trim()
        )
    ) {

        errors.customerEmail = "Enter a valid email address.";

    }

    /*
    |--------------------------------------------------------------------------
    | Order Items
    |--------------------------------------------------------------------------
    */

    if (order.items.length === 0) {

        errors.items = "Add at least one product to the order.";

    } else if (
        order.items.some(
            (item) => item.quantity <= 0
        )
    ) {

        errors.items = "Quantities must be greater than zero.";

    }

    return errors;

}
