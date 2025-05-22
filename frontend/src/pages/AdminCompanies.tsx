import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, ExternalLink, BookmarkX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import CompanyCard from '@/components/CompanyCard';



// Mock data for companies
const ALL_COMPANIES = [
    {
        company_id: 1,
        name: 'CarlaCo Enterprises',
        company_info: 'Innovatives Unternehmen für moderne Lösungen.',
        website: 'https://carlaco.com',
        email: 'info@carlaco.com',
        phone_number: '+43 123 456789',
        password: '',
        email_verified: true,
        admin_verified: true,
        company_registration_timestamp: '2024-01-01T10:00:00Z',
        email_verification_timestamp: '2024-01-02T10:00:00Z',
        admin_verification_timestamp: '2024-01-03T10:00:00Z',
        company_logo: '/assets/company-logos/LT-Studios_Logo.png',
        company_number: 'C-12345',
        internships: [1, 2],
    },
    {
        company_id: 2,
        name: 'LT-Studios',
        company_info: 'Fokus auf Medientechnik und Informatik.',
        website: 'https://ltstudios.at',
        email: 'kontakt@ltstudios.at',
        phone_number: '+43 987 654321',
        password: '',
        email_verified: true,
        admin_verified: false,
        company_registration_timestamp: '2024-02-01T10:00:00Z',
        email_verification_timestamp: '2024-02-02T10:00:00Z',
        admin_verification_timestamp: '',
        company_logo: '/assets/company-logos/LT-Studios_Logo.png',
        company_number: 'LT-12345',
        internships: [3],
    },
    {
        company_id: 3,
        name: 'ITMedia Solutions',
        company_info: 'IT-Dienstleistungen und Medien.',
        website: 'https://itmedia.at',
        email: 'office@itmedia.at',
        phone_number: '+43 555 123456',
        password: '',
        email_verified: false,
        admin_verified: false,
        company_registration_timestamp: '2024-03-01T10:00:00Z',
        email_verification_timestamp: '',
        admin_verification_timestamp: '',
        company_logo: '/assets/company-logos/LT-Studios_Logo.png',
        company_number: 'IT-98765',
        internships: [],
    },
    {
        company_id: 4,
        name: 'Elektronic Design',
        company_info: 'Elektroniklösungen für Unternehmen.',
        website: 'https://elektronicdesign.at',
        email: 'info@elektronicdesign.at',
        phone_number: '+43 222 333444',
        password: '',
        email_verified: true,
        admin_verified: true,
        company_registration_timestamp: '2024-04-01T10:00:00Z',
        email_verification_timestamp: '2024-04-02T10:00:00Z',
        admin_verification_timestamp: '2024-04-03T10:00:00Z',
        company_logo: '/assets/company-logos/LT-Studios_Logo.png',
        company_number: 'ED-54321',
        internships: [4],
    },
    {
        company_id: 5,
        name: 'MeliCorp',
        company_info: 'Innovative Lösungen für Unternehmen.',
        website: 'https://melicorp.com',
        email: 'kontakt@melicorp.com',
        phone_number: '+43 111 222333',
        password: '',
        email_verified: false,
        admin_verified: false,
        company_registration_timestamp: '2024-05-01T10:00:00Z',
        email_verification_timestamp: '',
        admin_verification_timestamp: '',
        company_logo: '/assets/company-logos/LT-Studios_Logo.png',
        company_number: 'MC-67890',
        internships: [],
    },
];

const getStatus = (company: any) => {
    if (company.admin_verified && company.email_verified) return 'vollständig';
    if (company.email_verified) return 'nur_email';
    return 'keine';
};


const AdminCompanies = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Nichts');

    let filteredCompanies = ALL_COMPANIES.filter((company) => {
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
                                {filteredCompanies.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredCompanies.map((company) => (
                                            <CompanyCard key={company.company_id} company={company}>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link to={`/companies/${company.company_id}`}>
                                                        <ExternalLink className="h-4 w-4 mr-1" />
                                                        Details
                                                    </Link>
                                                </Button>
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

export default AdminCompanies; 