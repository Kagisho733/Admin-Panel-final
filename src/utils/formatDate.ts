/*
|--------------------------------------------------------------------------
| Format Date
|--------------------------------------------------------------------------
*/

export function formatDate(date: Date) {

  return new Intl.DateTimeFormat("en-ZA").format(date);

}