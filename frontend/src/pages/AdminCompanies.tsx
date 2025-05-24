import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, ExternalLink, BookmarkX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import CompanyCard from '@/components/CompanyCard';
import { CompanyUIPropsAdmin } from '@/utils/interfaces';

const AdminCompanies = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Nichts');
    const [companies, setCompanies] = useState<CompanyUIPropsAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch('http://localhost:5000/api/company/');
                if (!res.ok) throw new Error('Fehler beim Laden der Unternehmen');
                const data = await res.json();
                // Map backend data to CompanyUIPropsAdmin if needed
                console.log(data);
                setCompanies(Array.isArray(data) ? data.map(mapBackendToCompanyUIPropsAdmin) : []);
            } catch (err: any) {
                setError(err.message || 'Unbekannter Fehler');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    let filteredCompanies = companies.filter((company) => {
        const term = searchTerm.toLowerCase();
        return (
            company.name.toLowerCase().includes(term) ||
            company.email.toLowerCase().includes(term) ||
            company.website.toLowerCase().includes(term) ||
            company.phone_number.toLowerCase().includes(term)
        );
    });

    if (sortBy === 'Verifizierungsstatus') {
        filteredCompanies = filteredCompanies.sort((a, b) => {
            // fully verified = 0, only email = 1, none = 2
            const getGroup = (c: any) => c.admin_verified && c.email_verified ? 0 : c.email_verified ? 1 : 2;
            return getGroup(a) - getGroup(b);
        });
    }

    return (
        <div className="flex min-h-screen">
            <AdminDashboardSidebar />
            <div className="flex-1 flex justify-center">
                <main className="w-full p-8 space-y-6 ">
                    <FadeIn>
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="heading-md text-left">Alle Unternehmen</h1>
                                <p className="text-muted-foreground text-left">
                                    Übersicht über alle registrierten Unternehmen
                                </p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Nach Name, E-Mail, Website, Telefon suchen..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={100}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>Alle Unternehmen</span>
                                </CardTitle>
                                <CardDescription className="text-left flex items-center justify-between">
                                    {filteredCompanies.length} Unternehmen gefunden
                                    <div className="flex items-center">
                                        <span className="text-sm text-muted-foreground mr-2">Sortieren nach:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="rounded-lg border border-input p-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-background text-foreground"
                                        >
                                            <option value="Nichts">Nichts</option>
                                            <option value="Verifizierungsstatus">Verifizierungsstatus</option>
                                        </select>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="text-center py-20">
                                        <FadeIn>
                                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4">
                                                <Search className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Lade Unternehmen...</h3>
                                        </FadeIn>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-20">
                                        <FadeIn>
                                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                                                <Search className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Fehler beim Laden der Unternehmen</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
                                        </FadeIn>
                                    </div>
                                ) : filteredCompanies.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredCompanies.map((company) => (
                                            <CompanyCard key={company.company_id} company={company}>
                                                {getStatus(company) === 'nur_email' ? (
                                                    <Button variant="default" size="sm">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Akzeptieren
                                                    </Button>
                                                ) : null}
                                                <Button variant="destructive" size="sm">
                                                    <BookmarkX className="h-4 w-4 mr-1" />
                                                    Entfernen
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link to={`/companies/${company.company_id}`}>
                                                        <ExternalLink className="h-4 w-4 mr-1" />
                                                        Details
                                                    </Link>
                                                </Button>
                                            </CompanyCard>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted text-muted-foreground mb-4">
                                            <Search className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">Keine Unternehmen gefunden</h3>
                                        <p className="text-muted-foreground">
                                            Keine Unternehmen entsprechen deiner Suche nach "{searchTerm}".
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </FadeIn>
                </main>
            </div>
        </div>
    );
};

function getStatus(company: any) {
    if (company.admin_verified && company.email_verified) return 'vollständig';
    if (company.email_verified) return 'nur_email';
    return 'keine';
}

function mapBackendToCompanyUIPropsAdmin(item: any): CompanyUIPropsAdmin {
    return {
        company_id: item.company_id,
        name: item.name,
        company_info: item.company_info ?? '',
        website: item.website ?? '',
        email: item.email ?? '',
        phone_number: item.phone_number ?? '',
        password: item.password ?? '',
        email_verified: item.email_verified === true || item.email_verified === 'true' || item.email_verified === 1,
        admin_verified: item.admin_verified === true || item.admin_verified === 'true' || item.admin_verified === 1,
        company_registration_timestamp: item.company_registration_timestamp ? new Date(item.company_registration_timestamp).toISOString() : '',
        email_verification_timestamp: item.email_verification_timestamp ? new Date(item.email_verification_timestamp).toISOString() : '',
        admin_verification_timestamp: item.admin_verification_timestamp ? new Date(item.admin_verification_timestamp).toISOString() : '',
        company_logo: item.company_logo ?? '',
        company_number: item.company_number ?? '',
        internships: Array.isArray(item.internships) ? item.internships : [],
    };
}

export default AdminCompanies; 