import type { Company } from "../types/Company";

export interface CompanyErrors {
  companyName?: string;
  registrationNumber?: string;
  email?: string;
  phone?: string;
  website?: string;
}

export function validateCompany(
  company: Company
): CompanyErrors {

  const errors: CompanyErrors = {};

  if (!company.companyName.trim()) {
    errors.companyName = "Company name is required.";
  }

  if (!company.registrationNumber.trim()) {
    errors.registrationNumber =
      "Registration number is required.";
  }

  if (!company.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!company.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  return errors;
}

export function hasCompanyErrors(
  errors: CompanyErrors
) {
  return Object.keys(errors).length > 0;
}