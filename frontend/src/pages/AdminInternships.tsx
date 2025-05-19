import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, BookmarkX, BriefcaseBusiness } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { InternshipUIProps } from '@/utils/interfaces';
import { cn } from '@/lib/utils';
import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import InternshipFilter from '@/components/InternshipFilter';

const mapBackendToInternshipProps = (item: any): InternshipUIProps => ({
    id: item._id || item.id,
    title: item.title,
    company_name: item.company_name,
    location: item.site,
    duration: item.duration,
    application_end: item.application_end ? new Date(item.application_end).toISOString().slice(0, 10) : '',
    added: item.added || '',
    clicks: item.clicks || 0,
    work_type: item.work_type,
    company_logo: item.company_logo,
    category: Array.isArray(item.department) ? item.department : [item.department],
    min_year: item.min_year ? `${item.min_year}. Schulstufe` : '',
    company_link: item.companyLink || '',
});


const AdminInternships = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Alle');
    const [selectedWorkMode, setSelectedWorkMode] = useState('Alle');
    const [selectedDuration, setSelectedDuration] = useState('Alle');
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('Alle Schulstufen');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [sortBy, setSortBy] = useState('Nichts');
    const [internships, setInternships] = useState<InternshipUIProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const filteredInternships = internships.filter((internship) => {
        const matchesSearch = searchTerm === '' ||
            internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.company_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'Alle' ||
            (Array.isArray(internship.category) && internship.category.includes(selectedCategory));

        const matchesWorkMode =
            selectedWorkMode === 'Alle' || internship.work_type === selectedWorkMode;

        const matchesDuration =
            selectedDuration === 'Alle' || internship.duration === selectedDuration;

        const matchesSchoolYear =
            selectedSchoolYear === 'Alle Schulstufen' || internship.min_year === selectedSchoolYear;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesWorkMode &&
            matchesDuration &&
            matchesSchoolYear
        );
    }).sort((a, b) => {
        if (sortBy === 'Abgelaufen') {
            return new Date(a.application_end).getTime() - new Date(b.application_end).getTime();
        }
        if (sortBy === 'Neueste') {
            return new Date(b.added).getTime() - new Date(a.added).getTime();
        }
        if (sortBy === 'Beliebteste') {
            return b.clicks - a.clicks;
        }
        if (sortBy === 'Aktuell Aktiv') {
            return new Date(b.application_end).getTime() - new Date(a.application_end).getTime();
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

    useEffect(() => {
        const fetchInternships = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch('http://localhost:5000/api/internship/current');
                if (!res.ok) throw new Error('Fehler beim Laden der Praktika');
                const data = await res.json();
                setInternships(Array.isArray(data) ? data.map(mapBackendToInternshipProps) : []);
            } catch (err: any) {
                setError(err.message || 'Unbekannter Fehler');
            } finally {
                setIsLoading(false);
            }
        };
        fetchInternships();
    }, []);

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
                                            <option value="Abgelaufen">Abgelaufen</option>
                                            <option value="Beliebteste">Beliebteste</option>
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
                                            <h3 className="text-xl font-semibold mb-2">Lade Praktika...</h3>
                                        </FadeIn>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-20">
                                        <FadeIn>
                                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                                                <Search className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">Fehler beim Laden der Praktika</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
                                        </FadeIn>
                                    </div>
                                ) :
                                    filteredInternships.length > 0 ? (
                                        <div className="space-y-4">
                                            {filteredInternships.map((internship) => (
                                                <div
                                                    key={internship.id}
                                                    className={cn(
                                                        "flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors",
                                                        isDeadlineExpired(internship.application_end) && "bg-gray-100 hover:bg-gray-200"
                                                    )}
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-left  ">{internship.title}</h3>
                                                        <div
                                                            className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-muted-foreground">
                                                            <span>{internship.company_name}</span>
                                                            <span>{internship.location}</span>
                                                            <span>Frist: {internship.application_end}</span>
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
                                                                {internship.work_type}
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