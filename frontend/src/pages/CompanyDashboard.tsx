import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {ICompanyPayload} from "@/utils/interfaces.ts";

const CompanyDashboard = () => {
    const [adminVerified, setAdminVerified] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("companyAccessToken");
        if (token) {
            const decoded : ICompanyPayload = jwtDecode(token);
            setAdminVerified(decoded.admin_verified);
        }
    }, []);
    return (
        <div className="flex min-h-screen">
        <CompanyDashboardSidebar/>
            <div className="flex-1 p-4">
                {!adminVerified && (
                    <div className="mb-4 rounded-md bg-yellow-200 border border-yellow-600 text-yellow-900  py-4">
                        Ihre Praktika sind derzeit nicht öffentlich sichtbar, da Ihr Unternehmen noch nicht von einem Administrator verifiziert wurde.
                    </div>
                )}
            </div>
        </div>
        );
}

export default CompanyDashboard;