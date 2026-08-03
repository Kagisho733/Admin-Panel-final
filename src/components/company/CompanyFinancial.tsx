import type { Company } from "../../types/Company";

interface Props {
  company: Company;
  setCompany: React.Dispatch<
    React.SetStateAction<Company>
  >;
}

export default function CompanyFinancial({
  company,
  setCompany,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h3 className="mb-6 text-2xl font-bold">
        Registration & Financial
      </h3>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Registration Number
          </label>

          <input
            value={company.registrationNumber}
            onChange={(e) =>
              setCompany({
                ...company,
                registrationNumber: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            VAT Number
          </label>

          <input
            value={company.vatNumber}
            onChange={(e) =>
              setCompany({
                ...company,
                vatNumber: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Tax Number
          </label>

          <input
            value={company.taxNumber}
            onChange={(e) =>
              setCompany({
                ...company,
                taxNumber: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Industry
          </label>

          <input
            value={company.industry}
            onChange={(e) =>
              setCompany({
                ...company,
                industry: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Business Description
          </label>

          <textarea
            rows={4}
            value={company.description}
            onChange={(e) =>
              setCompany({
                ...company,
                description: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />
        </div>

      </div>

    </div>
  );
}