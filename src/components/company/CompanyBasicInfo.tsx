import type { Company } from "../../types/Company";

interface Props {
  company: Company;
  setCompany: React.Dispatch<
    React.SetStateAction<Company>
  >;
}

export default function CompanyBasicInfo({
  company,
  setCompany,
}: Props) {

  return (

    <div className="rounded-2xl bg-white p-8 shadow">

      <h3 className="mb-6 text-2xl font-bold">

        Business Details

      </h3>

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-medium">

            Company Name

          </label>

          <input
            value={company.companyName}
            onChange={(e) =>
              setCompany({
                ...company,
                companyName: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">

            Trading Name

          </label>

          <input
            value={company.tradingName}
            onChange={(e) =>
              setCompany({
                ...company,
                tradingName: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
          />

        </div>

      </div>

    </div>

  );

}