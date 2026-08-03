
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { calculateCompanyProfileCompletion } from "../../utils/companyProfileCompletion";
import CompanySummaryCard from "./CompanySummaryCard";

import {
    getCompany,
    saveCompany,
} from "../../services/companyService";

import type { Company } from "../../types/Company";
import { defaultCompany } from "../../data/defaultCompany";
import CompanyBasicInfo from "./CompanyBasicInfo";
import CompanyAddress from "./CompanyAddress";
import CompanyContactInfo from "./CompanyContactInfo";
import CompanyFinancial from "./CompanyFinancial";
import CompanyBranding from "./CompanyBranding";

export default function CompanyProfileForm() {

    const [company, setCompany] =
        useState<Company>(defaultCompany);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const completion =
        calculateCompanyProfileCompletion(company);

    useEffect(() => {

        async function loadCompany() {

            try {

                const data = await getCompany();

                if (data) {

                    setCompany(data);

                }

            } catch (error) {

                console.error(error);

                toast.error("Failed to load company profile.");

            } finally {

                setLoading(false);

            }

        }

        loadCompany();

    }, []);

    <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">

        <div className="mb-3 flex items-center justify-between">

            <h3 className="text-lg font-semibold">

                Company Profile Completion

            </h3>

            <span className="font-bold text-blue-600">

                {completion}%

            </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

            <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                    width: `${completion}%`,
                }}
            />

        </div>

    </div>

    if (loading) {

        return (


            <div className="py-20 text-center">

                Loading company profile...

            </div>



        );

    }



    async function handleSave() {

        try {

            setSaving(true);

            await saveCompany(company);

            toast.success("Company profile saved successfully.");

        } catch (error) {

            console.error(error);

            toast.error("Failed to save company profile.");

        } finally {

            setSaving(false);

        }

    }

    return (

        <div className="space-y-8">

            <h2 className="text-3xl font-bold">

                Company Profile

            </h2>

            <CompanyBasicInfo
                company={company}
                setCompany={setCompany}
            />

            <CompanyAddress
                company={company}
                setCompany={setCompany}
            />

            <CompanyContactInfo
                company={company}
                setCompany={setCompany}
            />

            <CompanyFinancial
                company={company}
                setCompany={setCompany}
            />

            <CompanyBranding
                company={company}
                setCompany={setCompany}
                disabled={saving}
            />


            <div className="mb-8">
                <CompanySummaryCard
                    company={company}
                />
            </div>

            <div className="flex justify-end pt-8">

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="
      rounded-xl
      bg-blue-600
      px-8
      py-3
      font-semibold
      text-white
      transition
      hover:bg-blue-700
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
                >
                    {saving
                        ? "Saving..."
                        : "Save Company Profile"}
                </button>




            </div>





        </div>



    );

}