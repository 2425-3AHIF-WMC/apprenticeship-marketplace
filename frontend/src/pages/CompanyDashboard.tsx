import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { ICompanyPayload } from "@/utils/interfaces.ts";
import { Eye } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { fetchCompanyProfile } from "@/lib/authUtils.ts";

const CompanyDashboard = () => {
    const [adminVerified, setAdminVerified] = useState(true);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string | null>(null);
    const [viewsCount, setViewsCount] = useState<number | null>(null);
    const [loadingViews, setLoadingViews] = useState(false);
    const [loadingCompanyName, setLoadingCompanyName] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("companyAccessToken");
        if (token) {
            try {
                const decoded: ICompanyPayload = jwtDecode(token);
                setAdminVerified(decoded.admin_verified);
                setCompanyId(decoded.company_id?.toString() ?? null);
            } catch {
                setAdminVerified(false);
            }
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchCompanyProfile();
            setCompanyName(data ? data.name : null);
            setLoadingCompanyName(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        if (!companyId) {
            return;
        }

        const fetchViews = async () => {
            setLoadingViews(true);
            try {
                const res = await fetch(`http://localhost:5000/api/company/${companyId}/viewed_internships/count`);
                if (!res.ok) {
                    throw new Error("Fehler beim Laden der View-Anzahl");
                }
                const data = await res.json();
                setViewsCount(data ?? 0);
            } catch (e) {
                console.log(e)
            } finally {
                setLoadingViews(false);
            }
        };

        fetchViews();
    }, [companyId]);

    if(loadingCompanyName || loadingViews) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <CompanyDashboardSidebar />
            <main className="flex-1 p-8 flex flex-col gap-12">
                {!adminVerified && (
                    <div className="rounded-md bg-yellow-200 border border-yellow-600 text-yellow-900 py-4 px-6 max-w-3xl mx-auto">
                        Ihre Praktika sind derzeit nicht öffentlich sichtbar, da Ihr Unternehmen noch nicht von einem Administrator verifiziert wurde.
                    </div>
                )}

                <FadeIn direction="right" className="max-w-3xl  text-left font-semibold text-4xl select-none">
                    Hallo, {companyName}!
                </FadeIn>

                <div className="max-w-3xl mr-auto">
                    <div className="bg-accent rounded-lg shadow-md p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Eye className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Views in den letzten 30 Tagen</p>
                            {loadingViews ? (
                                <p className="text-xl font-semibold">Lade...</p>
                            ) : (
                                <p className="text-3xl font-bold">{viewsCount ?? 0}</p>
                            )}
                            <p className="text-gray-500 text-xs mt-1">auf Ihre Praktika</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyDashboard;
