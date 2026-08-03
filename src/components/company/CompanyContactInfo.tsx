import type { Company } from "../../types/Company";

interface Props {
  company: Company;
  setCompany: React.Dispatch<
    React.SetStateAction<Company>
  >;
}

export default function CompanyContactInfo({
  company,
  setCompany,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h3 className="mb-6 text-2xl font-bold">
        Contact Information
      </h3>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={company.email}
            onChange={(e) =>
              setCompany({
                ...company,
                email: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            value={company.phone}
            onChange={(e) =>
              setCompany({
                ...company,
                phone: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Website
          </label>

          <input
            value={company.website}
            onChange={(e) =>
              setCompany({
                ...company,
                website: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

      </div>

    </div>
  );
}