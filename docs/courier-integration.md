# Courier Guy integration

The admin UI uses the backend `/shipping` routes through the authenticated
API client. Courier credentials remain on the server.

- `GET|PUT /shipping/settings`: collection address, contact and operating hours.
- `GET /orders/:id`: persisted `order.shipping` and parcel measurements.
- `POST /shipping/orders/:id/shipments`: books the selected service from checkout.
- `POST /shipping/orders/:id/shipments/cancel`: cancels the courier shipment.
- `GET /shipping/orders/:id/tracking`: retrieves current tracking events.
- `GET /shipping/orders/:id/label`: returns a temporary signed PDF URL.

The shipping overview counters remain unavailable until the backend exposes
aggregate shipment counts. A booking needs saved collection settings, an order
with a selected service, and dimensions and weight for every product.
