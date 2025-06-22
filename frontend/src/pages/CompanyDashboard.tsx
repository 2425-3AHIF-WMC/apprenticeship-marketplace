import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { ICompanyPayload, InternshipMappedProps, InternshipUIProps } from "@/utils/interfaces.ts";
import { BookmarkIcon, Eye, Plus, Files, Settings } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import { fetchCompanyProfile } from "@/lib/authUtils.ts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorIndicator from "@/components/ErrorIndicator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const CompanyDashboard = () => {
    const [adminVerified, setAdminVerified] = useState(true);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string | null>(null);
    const [viewsCount, setViewsCount] = useState<number | null>(null);
    const [clickCount, setClickCount] = useState<number | null>(null);
    const [favCount, setFavCount] = useState<number | null>(null);
    const [loadingViews, setLoadingViews] = useState(false);
    const [loadingCompanyName, setLoadingCompanyName] = useState(true);

    const [internships, setInternships] = useState<InternshipUIProps[]>([]);
    const [loadingInternships, setLoadingInternships] = useState(true);
    const [errorInternships, setErrorInternships] = useState<string | null>(null);
    const isMobile = useIsMobile();

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
        const fetchInternships = async () => {
            setLoadingInternships(true);
            setErrorInternships(null);
            try {
                const token = localStorage.getItem("companyAccessToken");
                if (!token) {
                    throw new Error("Kein Token gefunden");
                }

                const payload = JSON.parse(atob(token.split(".")[1]));
                const companyId = payload.company_id;
                if (!companyId) {
                    throw new Error("Keine Company-ID im Token");
                }

                setCompanyId(companyId);

                const response = await fetch(`http://localhost:5000/api/company/${companyId}/internships`);
                if (!response.ok && response.status !== 404) {
                    throw new Error("Fehler beim Laden der Praktika");
                }

                const data = await response.json() as InternshipMappedProps[];
                const transformed: InternshipUIProps[] = data.map((item: InternshipMappedProps) => ({
                    ...item,
                    id: item.internship_id,
                    department: item.category
                }));
                setInternships(transformed);

            } catch (err) {
                setErrorInternships(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
                toast.error('Fehler beim Laden der Praktika');
            } finally {
                setLoadingInternships(false);
            }
        };

        fetchInternships();
    }, [companyId]);

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

    useEffect(() => {
        const fetchClicks = async () =>{
            setLoadingViews(true);
            try{
                const res = await fetch(`http://localhost:5000/api/company/${companyId}/clicked_apply_internships/count/last_90_days`);
                if(!res.ok){
                    throw new Error("Fehler beim Laden der Click-Anzahl");
                }
                const data = await res.json();
                setClickCount(data ?? 0);
            } catch (e) {
                console.log(e)
            } finally {
                setLoadingViews(false);
            }
        };
        fetchClicks();
    }, [companyId]);

    useEffect(() => {
        const fetchFavourites = async () =>{
            setLoadingViews(true);
            try{
                const res = await fetch(`http://localhost:5000/api/company/${companyId}/favourite_internships/count`);
                if(!res.ok){
                    throw new Error("Fehler beim Laden der Favorite-Anzahl");
                }
                const data = await res.json();
                setFavCount(data ?? 0);
            } catch (e) {
                console.log(e)
            } finally {
                setLoadingViews(false);
            }
        };
        fetchFavourites();
    }, [companyId]);

    const quickLinks = [
        { to: '/company/internships', icon: Files, label: 'Alle Praktika' },
        { to: '/company/internship/create', icon: Plus, label: 'Praktikum erstellen' },
        { to: '/company/settings', icon: Settings, label: 'Einstellungen' },
    ];

    if (loadingCompanyName || loadingViews) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <CompanyDashboardSidebar />
            <div className="flex-1 flex justify-center">
                <main className="w-full max-w-7xl p-8">
                    {!adminVerified && (
                        <div className="rounded-md bg-yellow-200 border border-yellow-600 text-yellow-900 py-4 px-6 max-w-3xl mx-auto">
                            Ihre Praktika sind derzeit nicht Ã¶ffentlich sichtbar, da Ihr Unternehmen noch nicht von einem Administrator verifiziert wurde.
                        </div>
                    )}

                    <FadeIn direction="right" className="max-w-3xl text-left font-semibold text-4xl select-none">
                        <h1 className="heading-md">Hallo, {companyName}!</h1>
                    </FadeIn>

                    <div className="space-y-8 mt-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <FadeIn delay={100}>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-medium">Views</CardTitle>
                                        <CardDescription>Views in den letzten 30 Tagen auf Ihre Praktika</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center">
                                            <Eye className="h-8 w-8 text-primary mr-3" />
                                            <div className="text-3xl font-semibold">{viewsCount ?? 0}</div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </FadeIn>
                            <FadeIn delay={100}>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-medium">Clicks</CardTitle>
                                        <CardDescription>Clicks in den letzten 90 Tagen auf Ihre Praktika</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center">
                                            <Eye className="h-8 w-8 text-primary mr-3" />
                                            <div className="text-3xl font-semibold">{clickCount ?? 0}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                            <FadeIn delay={100}>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-medium">Favorites</CardTitle>
                                        <CardDescription>Favoriten auf alle Ihre Praktika</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center">
                                            <Eye className="h-8 w-8 text-primary mr-3" />
                                            <div className="text-3xl font-semibold">{favCount ?? 0}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </FadeIn>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <FadeIn delay={200}>
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div className="text-left">
                                                <CardTitle>Ihre Praktika</CardTitle>
                                                <CardDescription>Praktika, die Sie angelegt haben</CardDescription>
                                            </div>
                                            <Button asChild>
                                                <Link to="/company/internships">
                                                    <BookmarkIcon className="h-4 w-4 md:mr-2" />
                                                    {!isMobile && "Alle anzeigen"}
                                                </Link>
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            {
                                                loadingInternships ? (
                                                        <div className="text-center py-8">
                                                            <LoadingIndicator />
                                                        </div>
                                                    ) :
                                                    errorInternships ? (
                                                            <div className="text-center py-8">
                                                                <ErrorIndicator />
                                                            </div>
                                                        ) :
                                                        internships.length > 0 ? (
                                                            <div className="space-y-4">
                                                                {internships.slice(0, 3).map((internship) => (
                                                                    <div key={internship.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                                        <div className="flex flex-col">
                                                                            <h3 className="font-medium">{internship.title}</h3>

                                                                        </div>
                                                                        <Button variant="outline" size="sm" asChild>
                                                                            <Link to={`/internships/${internship.id}`} state={{ backPath: '/company/dashboard' }}>
                                                                                Details
                                                                            </Link>
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8">
                                                                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                                                                    <BookmarkIcon className="h-6 w-6" />
                                                                </div>
                                                                <h3 className="text-lg font-medium mb-2">Keine Praktika vorhanden</h3>
                                                                <p className="text-muted-foreground mb-4">Du hast noch keine Praktika als Favoriten gespeichert.</p>
                                                                <Button asChild>
                                                                    <Link to="/internships">Praktika durchsuchen</Link>
                                                                </Button>
                                                            </div>
                                                        )}
                                        </CardContent>
                                    </Card>
                                </FadeIn>
                            </div>

                            <div>
                                <FadeIn delay={250}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Schnellzugriff</CardTitle>
                                            <CardDescription>HÃ¤ufig verwendete Aktionen</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {quickLinks.map((link) => (
                                                <Button
                                                    key={link.to}
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                    asChild
                                                >
                                                    <Link to={link.to}>
                                                        <link.icon className="h-4 w-4 mr-2" />
                                                        {link.label}
                                                    </Link>
                                                </Button>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </FadeIn>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};


export default CompanyDashboard;