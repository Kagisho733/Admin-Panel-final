import type { Company } from "../types/Company";

export const defaultCompany: Company = {
  id: "profile",

  companyName: "",
  tradingName: "",

  registrationNumber: "",
  vatNumber: "",
  taxNumber: "",

  industry: "",
  description: "",

  email: "",
  phone: "",
  website: "",

  addressLine1: "",
  addressLine2: "",

  city: "",
  province: "",
  postalCode: "",

  country: "South Africa",

  logoUrl: "",

  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",

  currency: "ZAR",
  timezone: "Africa/Johannesburg",
};