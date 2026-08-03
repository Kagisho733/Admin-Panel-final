import type { Company } from "../../types/Company";
import CompanyLogoUploader from "./CompanyLogoUploader";

interface Props {
  company: Company;
  setCompany: React.Dispatch<
    React.SetStateAction<Company>
  >;
  disabled: boolean;
}

export default function CompanyBranding({
  company,
  setCompany,
  disabled,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h3 className="mb-6 text-2xl font-bold">
        Branding
      </h3>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-medium">
            Company Logo URL
          </label>

          <div className="md:col-span-2">

            <CompanyLogoUploader
              company={company}
              setCompany={setCompany}
              disabled={disabled}
            />

            {company.logoUrl && (

              <div className="mt-8 flex flex-col items-center rounded-2xl border bg-slate-50 p-6">

                <p className="mb-4 text-sm font-semibold text-slate-500">

                  Company Logo Preview

                </p>

                <img
                  src={company.logoUrl}
                  alt="Company Logo"
                  className="max-h-40 rounded-xl border bg-white p-3 shadow"
                />

              </div>

            )}

          </div>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Primary Brand Color
          </label>

          <input
            type="color"
            value={company.primaryColor}
            onChange={(e) =>
              setCompany({
                ...company,
                primaryColor: e.target.value,
              })
            }
            className="h-12 w-full rounded-xl border"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Secondary Brand Color
          </label>

          <input
            type="color"
            value={company.secondaryColor}
            onChange={(e) =>
              setCompany({
                ...company,
                secondaryColor: e.target.value,
              })
            }
            className="h-12 w-full rounded-xl border"
          />

        </div>

      </div>

    </div>
  );
}