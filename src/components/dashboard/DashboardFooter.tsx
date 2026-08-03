/*
|--------------------------------------------------------------------------
| Dashboard Footer
|--------------------------------------------------------------------------
| Displays application information.
| Later Firebase status, deployment version and logged-in admin can
| also be displayed here.
|--------------------------------------------------------------------------
*/

import {
    FaReact,
    FaFire,
    FaCodeBranch,
    FaCheckCircle
} from "react-icons/fa";

export default function DashboardFooter() {

    return (

        <footer className="mt-16 border-t border-gray-200 pt-8">

            <div className="grid md:grid-cols-4 gap-8">

                {/* Brand */}

                <div>

                    <h2 className="font-bold text-lg">

                        📚 Books • Bots • Drones

                    </h2>

                    <p className="text-gray-500 mt-2">

                        Professional Administration Dashboard

                    </p>

                </div>

                {/* Version */}

                <div>

                    <h3 className="font-semibold mb-2">

                        Version

                    </h3>

                    <div className="flex items-center gap-2">

                        <FaCodeBranch />

                        v1.0.0

                    </div>

                </div>

                {/* Tech Stack */}

                <div>

                    <h3 className="font-semibold mb-2">

                        Technology

                    </h3>

                    <div className="space-y-2">

                        <div className="flex items-center gap-2">

                            <FaReact className="text-blue-500"/>

                            React + TypeScript

                        </div>

                        <div className="flex items-center gap-2">

                            <FaFire className="text-orange-500"/>

                            Firebase Ready

                        </div>

                    </div>

                </div>

                {/* Status */}

                <div>

                    <h3 className="font-semibold mb-2">

                        System Status

                    </h3>

                    <div className="flex items-center gap-2 text-green-600">

                        <FaCheckCircle/>

                        Dashboard Operational

                    </div>

                </div>

            </div>

            <div className="text-center mt-10 text-gray-400 text-sm">

                © 2026 Books • Bots • Drones.
                Built with React, TypeScript,
                Tailwind CSS and Firebase.

            </div>

        </footer>

    );

}