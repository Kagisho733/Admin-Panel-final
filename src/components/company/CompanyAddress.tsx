import type { Company } from "../../types/Company";

interface Props {
  company: Company;
  setCompany: React.Dispatch<
    React.SetStateAction<Company>
  >;
}

export default function CompanyAddress({
  company,
  setCompany,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h3 className="mb-6 text-2xl font-bold">
        Address
      </h3>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Address Line 1
          </label>

          <input
            value={company.addressLine1}
            onChange={(e) =>
              setCompany({
                ...company,
                addressLine1: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Address Line 2
          </label>

          <input
            value={company.addressLine2}
            onChange={(e) =>
              setCompany({
                ...company,
                addressLine2: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            City
          </label>

          <input
            value={company.city}
            onChange={(e) =>
              setCompany({
                ...company,
                city: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Province
          </label>

          <input
            value={company.province}
            onChange={(e) =>
              setCompany({
                ...company,
                province: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Postal Code
          </label>

          <input
            value={company.postalCode}
            onChange={(e) =>
              setCompany({
                ...company,
                postalCode: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Country
          </label>

          <input
            value={company.country}
            onChange={(e) =>
              setCompany({
                ...company,
                country: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

      </div>

    </div>
  );
}