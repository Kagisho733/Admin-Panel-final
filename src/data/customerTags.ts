/*
|--------------------------------------------------------------------------
| Customer Tags
|--------------------------------------------------------------------------
| Centralized list of customer tags used across the CRM module.
|--------------------------------------------------------------------------
*/

export const customerTags = [

  "VIP",

  "Wholesale",

  "Retail",

  "Loyal",

  "New",

  "At Risk",

  "Follow Up",

  "Blacklisted",

];

/*
|--------------------------------------------------------------------------
| Customer Tag Colors
|--------------------------------------------------------------------------
| Tailwind classes used by the customer tag badge.
|--------------------------------------------------------------------------
*/

export const customerTagColors: Record<string, string> = {

  "VIP": "bg-yellow-100 text-yellow-800",

  "Wholesale": "bg-indigo-100 text-indigo-800",

  "Retail": "bg-blue-100 text-blue-800",

  "Loyal": "bg-emerald-100 text-emerald-800",

  "New": "bg-sky-100 text-sky-800",

  "At Risk": "bg-orange-100 text-orange-800",

  "Follow Up": "bg-purple-100 text-purple-800",

  "Blacklisted": "bg-red-100 text-red-800",

};
