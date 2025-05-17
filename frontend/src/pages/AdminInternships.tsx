import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, BookmarkX, BriefcaseBusiness } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { InternshipProps } from '@/components/InternshipCard';
import { cn } from '@/lib/utils';
import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import InternshipFilter from '@/components/InternshipFilter';


const ALL_INTERNSHIPS: InternshipProps[] = [
    {
        id: '1',
        title: 'Software-Entwicklungs Praktikum',
        company: 'CarlaCo Enterprises',
        location: 'Wien',
        duration: 'variabel',
        deadline: '2025-05-15',
        added: '2025-04-02',
        clicks: 132,
        workMode: 'On-site',
        logo: '/assets/company-logos/CarlaCoEnterprises_Logo.png',
        category: ['Informatik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/carlaco'
    },
    {
        id: '2',
        title: 'Marketing Assistent',
        company: 'LT-Studios',
        location: 'Graz',
        duration: '6 Wochen',
        deadline: '2025-07-30',
        added: '2025-03-29',
        clicks: 89,
        workMode: 'Hybrid',
        logo: '/assets/company-logos/LT-Studios_Logo.png',
        category: ['Medientechnik'],
        schoolYear: '4. Schulstufe',
        companyLink: 'https://random-company.com/ltstudios'
    },
    {
        id: '3',
        title: 'UX/UI Design Praktikum',
        company: 'ITMedia Solutions',
        duration: '4 Wochen',
        deadline: '2025-05-05',
        added: '2025-04-01',
        clicks: 205,
        location: "Linz",
        workMode: 'Remote',
        logo: '/assets/company-logos/ITMediaSolutions_Logo.png',
        category: ['Medientechnik', 'Informatik', 'Medizintechnik', 'Elektronik'],
        schoolYear: '2. Schulstufe',
        companyLink: 'https://random-company.com/itmediasolutions'
    },
    {
        id: '4',
        title: 'Elektronik-Entwickler Praktikum',
        company: 'Elektronic Design',
        location: 'Linz',
        duration: '8 Wochen',
        deadline: '2025-05-20',
        added: '2025-03-27',
        clicks: 97,
        workMode: 'On-site',
        logo: '/assets/company-logos/ElektronicDesign_Logo.png',
        category: ['Elektronik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/elektronicdesign'
    },
    {
        id: '5',
        title: 'Datenwissenschafts Praktikum',
        company: 'MeliCorp',
        location: 'Salzburg',
        duration: '6 Wochen',
        deadline: '2025-04-25',
        added: '2025-04-03',
        clicks: 178,
        workMode: 'Hybrid',
        logo: '/assets/company-logos/MeliCorp_Logo.png',
        category: ['Informatik'],
        schoolYear: '4. Schulstufe',
        companyLink: 'https://random-company.com/melicorp'
    },
    {
        id: '6',
        title: 'Medizintechnik Praktikum',
        company: 'TechMed Innovations',
        location: 'Innsbruck',
        duration: 'variabel',
        deadline: '2025-05-10',
        added: '2025-04-01',
        clicks: 122,
        workMode: 'On-site',
        logo: '/assets/company-logos/TechMed_Innovations_Logo.png',
        category: ['Medientechnik', 'Informatik', 'Medizintechnik', 'Elektronik'],
        schoolYear: '4. Schulstufe',
        companyLink: 'https://random-company.com/techmed'
    },
    {
        id: '7',
        title: 'Projekt Management Praktikum',
        company: 'Nexus Solutions',
        location: 'Wien',
        duration: '4 Wochen',
        deadline: '2025-05-22',
        added: '2025-04-06',
        clicks: 145,
        workMode: 'Hybrid',
        logo: '/assets/company-logos/NexusSolutions_Logo.png',
        category: ['Informatik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/nexus'
    },
    {
        id: '8',
        title: 'Frontend-Entwicklung Praktikum',
        company: 'Elysee Industries',
        duration: '4 Wochen',
        deadline: '2025-05-12',
        added: '2025-04-04',
        location: "Linz",
        clicks: 230,
        workMode: 'Remote',
        logo: '/assets/company-logos/ElyseeIndustries_Logo.png',
        category: ['Informatik'],
        schoolYear: '2. Schulstufe',
        companyLink: 'https://random-company.com/elysee'
    },
    {
        id: '9',
        title: 'Grafikdesign Praktikum',
        company: 'LuminaTech',
        location: 'Graz',
        duration: '6 Wochen',
        deadline: '2025-04-28',
        added: '2025-03-30',
        clicks: 101,
        workMode: 'On-site',
        logo: '/assets/company-logos/LuminaTech_Logo.png',
        category: ['Medientechnik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/lumina'
    }
];

const AdminInternships = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('Alle');
    const [selectedWorkMode, setSelectedWorkMode] = useState('Alle');
    const [selectedDuration, setSelectedDuration] = useState('Alle');
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('Alle Schulstufen');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [sortBy, setSortBy] = useState('Nichts');

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('Alle');
        setSelectedWorkMode('Alle');
        setSelectedDuration('Alle');
        setSelectedSchoolYear('Alle Schulstufen');
    };

    const hasActiveFilters =
        searchTerm !== '' ||
        selectedCategory !== 'Alle' ||
        selectedWorkMode !== 'Alle' ||
        selectedDuration !== 'Alle' ||
        selectedSchoolYear !== 'Alle Schulstufen';

    const filteredInternships = ALL_INTERNSHIPS.filter((internship) => {
        const matchesSearch = searchTerm === '' ||
            internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'Alle' ||
            (Array.isArray(internship.category) && internship.category.includes(selectedCategory));

        const matchesWorkMode =
            selectedWorkMode === 'Alle' || internship.workMode === selectedWorkMode;

        const matchesDuration =
            selectedDuration === 'Alle' || internship.duration === selectedDuration;

        const matchesSchoolYear =
            selectedSchoolYear === 'Alle Schulstufen' || internship.schoolYear === selectedSchoolYear;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesWorkMode &&
            matchesDuration &&
            matchesSchoolYear
        );
    }).sort((a, b) => {
        if (sortBy === 'älteste Bewerbungsfrist') {
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        if (sortBy === 'Neueste') {
            return new Date(b.added).getTime() - new Date(a.added).getTime();
        }
        if (sortBy === 'Beliebteste') {
            return b.clicks - a.clicks;
        }
        if (sortBy === 'Aktuell Aktiv') {
            return new Date(b.deadline).getTime()- new Date(a.deadline).getTime();
        }
        return 0;
    });

    const getCategoryClasses = (category: string) => {
        return `tag-${category}`;
    };
    const isDeadlineExpired = (deadline: string) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        return deadlineDate < today;
    };

    return (
        <div className="flex min-h-screen">
            <AdminDashboardSidebar />
            <div className="flex-1 flex justify-center">
                <main className="w-full p-8 space-y-6 ">
                    <FadeIn>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="heading-md text-left">Alle Praktika</h1>
                                <p className="text-muted-foreground text-left">
                                    Übersicht über alle Praktikumsangebote
                                </p>
                            </div>
                        </div>
                    </FadeIn>

                    <InternshipFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedWorkMode={selectedWorkMode}
                        setSelectedWorkMode={setSelectedWorkMode}
                        selectedDuration={selectedDuration}
                        setSelectedDuration={setSelectedDuration}
                        selectedSchoolYear={selectedSchoolYear}
                        setSelectedSchoolYear={setSelectedSchoolYear}
                        filtersVisible={filtersVisible}
                        setFiltersVisible={setFiltersVisible}
                        clearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                    <FadeIn delay={100}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>Alle Praktika</span>
                                </CardTitle>
                                <CardDescription className="text-left flex items-center justify-between">
                                    {filteredInternships.length} {filteredInternships.length === 1 ? 'Praktikum' : 'Praktika'} gefunden
                                    <div className="flex items-center">
                                        <span className="text-sm text-muted-foreground mr-2">Sortieren nach:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="rounded-lg border border-input p-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-background text-foreground"
                                        >
                                            <option value="Nichts">Nichts</option>
                                            <option value="Aktuell Aktiv">Aktuell Aktiv</option>
                                            <option value="Neueste">Neueste</option>
                                            <option value="älteste Bewerbungsfrist">Bewerbungsfrist</option>
                                            <option value="Beliebteste">Beliebteste</option>
                                        </select>

                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {filteredInternships.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredInternships.map((internship) => (
                                            <div
                                                key={internship.id}
                                                className={cn(
                                                    "flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors",
                                                    isDeadlineExpired(internship.deadline) && "bg-gray-100 hover:bg-gray-200"
                                                )}
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-left  ">{internship.title}</h3>
                                                    <div
                                                        className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-muted-foreground">
                                                        <span>{internship.company}</span>
                                                        <span>{internship.location}</span>
                                                        <span>Frist: {internship.deadline}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {Array.isArray(internship.category) ? (
                                                            internship.category.map((cat, index) => (
                                                                <span
                                                                    key={`${cat}-${index}`}
                                                                    className={cn(
                                                                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                                        getCategoryClasses(cat)
                                                                    )}
                                                                >
                                                                    {cat}
                                                                </span>

                                                            ))
                                                        ) : (
                                                            <span className={cn(
                                                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                                getCategoryClasses(internship.category)
                                                            )}>
                                                                {internship.category}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {internship.workMode}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-2 self-end md:self-auto">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link to={`/internships/${internship.id}`}>
                                                            <ExternalLink className="h-4 w-4 mr-1" />
                                                            Details
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <BookmarkX className="h-4 w-4 mr-1" />
                                                        Entfernen
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                        )}
                                    </div>
                                ) :
                                    (
                                        <div className="text-center py-8">
                                            {searchTerm ? (
                                                <>
                                                    <div
                                                        className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted text-muted-foreground mb-4">
                                                        <Search className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-lg font-medium mb-2">Keine Ergebnisse gefunden</h3>
                                                    <p className="text-muted-foreground">
                                                        Keine Favoriten entsprechen deiner Suche nach "{searchTerm}".
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <div
                                                        className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                                                        <BriefcaseBusiness className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-lg font-medium mb-2">Keine Praktika vorhanden</h3>
                                                    <p className="text-muted-foreground mb-4">
                                                        Es wurden noch keine Praktika erstellt.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </FadeIn>
                </main>
            </div>
        </div>
    );
};

export default AdminInternships; 