import CompanyProfileForm
from "../../components/company/CompanyProfileForm";

export default function CompanyPage() {

  return (

    <div className="space-y-8 p-8">

      <div>

        <h1 className="text-3xl font-bold">

          Company Profile

        </h1>

        <p className="mt-2 text-gray-500">

          Your business details, used on invoices and documents.

        </p>

      </div>

      <CompanyProfileForm />

    </div>

  );

}
