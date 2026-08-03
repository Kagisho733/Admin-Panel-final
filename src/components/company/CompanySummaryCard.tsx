import type { Company } from "../../types/Company";

interface Props {
  company: Company;
}

export default function CompanySummaryCard({
  company,
}: Props) {

  return (

    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex items-center gap-6">

        {company.logoUrl ? (

          <img
            src={company.logoUrl}
            alt={company.companyName}
            className="h-24 w-24 rounded-xl border bg-white object-contain p-2"
          />

        ) : (

          <div className="flex h-24 w-24 items-center justify-center rounded-xl border bg-slate-100 text-3xl">

            🏢

          </div>

        )}

        <div className="flex-1">

          <h2 className="text-2xl font-bold">

            {company.companyName}

          </h2>

          {company.tradingName && (

            <p className="text-slate-500">

              Trading as {company.tradingName}

            </p>

          )}

          <div className="mt-4 grid gap-2 md:grid-cols-2">

            <p>

              <span className="font-semibold">

                Registration:

              </span>{" "}

              {company.registrationNumber || "-"}

            </p>

            <p>

              <span className="font-semibold">

                VAT:

              </span>{" "}

              {company.vatNumber || "-"}

            </p>

            <p>

              <span className="font-semibold">

                Email:

              </span>{" "}

              {company.email || "-"}

            </p>

            <p>

              <span className="font-semibold">

                Phone:

              </span>{" "}

              {company.phone || "-"}

            </p>

            <p>

              <span className="font-semibold">

                Website:

              </span>{" "}

              {company.website || "-"}

            </p>

            <p>

              <span className="font-semibold">

                Country:

              </span>{" "}

              {company.country || "-"}

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}