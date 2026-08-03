/*
|--------------------------------------------------------------------------
| Format Currency
|--------------------------------------------------------------------------
*/

export function formatCurrency(price: number) {

  return new Intl.NumberFormat("en-ZA", {

    style: "currency",

    currency: "ZAR",

  }).format(price);

}