import type { Company } from "../../types/Company";
import ImageUploader from "../products/ImageUploader";

interface Props {
  company: Company;
  setCompany: React.Dispatch<
    React.SetStateAction<Company>
  >;
  disabled: boolean;
}

export default function CompanyLogoUploader({
  company,
  setCompany,
  disabled,
}: Props) {
  return (
    <ImageUploader
      id="company-logo"
      label="Company Logo"
      imageUrl={company.logoUrl}
      disabled={disabled}
      onImageUploaded={(url) =>
        setCompany({
          ...company,
          logoUrl: url,
        })
      }
    />
  );
}