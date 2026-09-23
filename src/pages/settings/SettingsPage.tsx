import CourierSettingsForm from "../../components/settings/CourierSettingsForm";
import SettingsCard from "../../components/settings/SettingsCard";
import AdminProfile from "../../components/settings/AdminProfile";
import CompanyProfileForm from "../../components/company/CompanyProfileForm";

export default function SettingsPage() {

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">
                    Settings
                </h1>

                <p className="mt-2 text-gray-500">
                    Configure your Books • Bots administration platform.
                </p>


            </div>

            <AdminProfile />
            <CourierSettingsForm />

            <div className="grid gap-6 md:grid-cols-2">



                <SettingsCard
                    title="Administrator Profile"
                    description="Manage your administrator account."
                />

                <SettingsCard
                    title="Company"
                    description="Manage company information."
                />

                <SettingsCard
                    title="Security"
                    description="Password and authentication settings."
                />

                <SettingsCard
                    title="Appearance"
                    description="Theme and dashboard preferences."
                />

                <SettingsCard
                    title="Notifications"
                    description="Manage email and system notifications."
                />

                <SettingsCard
                    title="Activity Log"
                    description="View administrator activity."
                />

            </div>

            <div className="mt-10">

                <CompanyProfileForm />

            </div>

        </div>

    );

}