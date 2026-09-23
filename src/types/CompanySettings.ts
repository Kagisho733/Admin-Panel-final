import type { CourierSettings } from "./Courier";
export interface CompanySettings {
  courierSettings?: CourierSettings;
  companyName: string;
  companyEmail: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  vatNumber: string;
  registrationNumber: string;
  currency: string;
  timezone: string;
  logo?: string;
}