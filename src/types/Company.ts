export interface Company {
  id: string;

  companyName: string;
  tradingName: string;

  registrationNumber: string;
  vatNumber: string;
  taxNumber: string;

  industry: string;
  description: string;

  email: string;
  phone: string;
  website: string;

  addressLine1: string;
  addressLine2: string;

  city: string;
  province: string;
  postalCode: string;
  country: string;

  logoUrl: string;

  primaryColor: string;
  secondaryColor: string;

  currency: string;
  timezone: string;

  createdAt?: Date;
  updatedAt?: Date;
}