export interface CustomerActivity {

  id: string;

  customerId: string;

 type:
"note"
| "order"
| "email"
| "invoice"
| "customer"
| "status";

  title: string;

  description: string;

  createdAt: any;

}