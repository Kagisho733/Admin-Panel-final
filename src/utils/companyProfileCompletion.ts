import type { Company } from "../types/Company";

export function calculateCompanyProfileCompletion(
  company: Company
): number {

const fields = [

  company.companyName,
  company.tradingName,

  company.registrationNumber,
  company.vatNumber,
  company.taxNumber,

  company.industry,
  company.description,

  company.email,
  company.phone,
  company.website,

  company.addressLine1,
  company.addressLine2,

  company.city,
  company.province,
  company.postalCode,
  company.country,

  company.logoUrl,

  company.primaryColor,
  company.secondaryColor,

  company.currency,
  company.timezone,

];

  const completed = fields.filter(
    (field) =>
      field !== undefined &&
      field !== null &&
      String(field).trim() !== ""
  ).length;

  return Math.round(
    (completed / fields.length) * 100
  );

}