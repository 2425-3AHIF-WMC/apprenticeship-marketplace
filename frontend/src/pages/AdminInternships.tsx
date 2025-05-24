import { useEffect, useState } from 'react';
import { Search, BriefcaseBusiness, X } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { InternshipUIProps } from '@/utils/interfaces';
import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import InternshipFilter from '@/components/InternshipFilter';
import InternshipCard from '@/components/InternshipCard';

const mapBackendToInternshipProps = (item: any): InternshipUIProps => ({
    id: item.internship_id,
    title: item.title,
    company_name: item.company_name,
    location: item.location,
    duration: item.duration,
    application_end: item.application_end ? new Date(item.application_end).toISOString().slice(0, 10) : '',
    added: item.added || '',
    views: item.views || 0,
    work_type: item.work_type,
    company_logo: item.company_logo,
    department: Array.isArray(item.category) ? item.category : [item.category],
    min_year: item.min_year ? `${item.min_year}. Schulstufe` : '',
    company_link: item.companyLink || '',
    internship_link: item.internship_link || '',
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

    // Helper to extract the year as a number from min_year string
    const getYearNumber = (minYear: string) => {
        const match = minYear.match(/(\d)\. Schulstufe/);
        return match ? parseInt(match[1], 10) : null;
    };

    let filteredInternships = internships.filter((internship) => {
        const matchesSearch = searchTerm === '' ||
            internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            internship.company_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === 'Alle' ||
            (Array.isArray(internship.department) && internship.department.includes(selectedCategory));

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
    });

    // Default: sort by school year if no other sort is selected
    if (sortBy === 'Nichts' && selectedSchoolYear !== 'Alle Schulstufen') {
        const selectedYear = getYearNumber(selectedSchoolYear);
        if (selectedYear !== null) {
            filteredInternships = filteredInternships.sort((a, b) => {
                const yearA = getYearNumber(a.min_year) ?? 0;
                const yearB = getYearNumber(b.min_year) ?? 0;
                // First, internships for the selected year, then lower years
                if (yearA === selectedYear && yearB !== selectedYear) return -1;
                if (yearB === selectedYear && yearA !== selectedYear) return 1;
                // Then by year descending (3, 2, 1)
                return yearB - yearA;
            });
        }
    } else {
        // Admin-specific sort options
        const sortFn = (a: InternshipUIProps, b: InternshipUIProps) => {
            if (sortBy === 'Abgelaufen') {
                return new Date(a.application_end).getTime() - new Date(b.application_end).getTime();
            }
            if (sortBy === 'Neueste') {
                return new Date(b.added).getTime() - new Date(a.added).getTime();
            }
            if (sortBy === 'Beliebteste') {
                return b.views - a.views;
            }
            if (sortBy === 'Aktuell Aktiv') {
                return new Date(b.application_end).getTime() - new Date(a.application_end).getTime();
            }
            return 0;
        };
        filteredInternships = filteredInternships.sort(sortFn);
    }
    const isDeadlineExpired = (deadline: string) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        return deadlineDate < today;
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/internship/delete/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Fehler beim Löschen des Praktikums');
            setInternships((prev) => prev.filter((i) => i.id !== id));
        } catch (err) {
            alert('Fehler beim Löschen des Praktikums');
        }
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
                                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredInternships.map((internship, index) => (
                                                <FadeIn key={internship.id} delay={index * 50}>
                                                    <div
                                                        className={
                                                            `relative ${isDeadlineExpired(internship.application_end) ? 'bg-gray-100 hover:bg-gray-200' : ''}`
                                                        }
                                                    >
                                                        <button
                                                            onClick={() => handleDelete(internship.id)}
                                                            className="absolute top-3 right-3 z-10 text-red-600 hover:text-red-800 bg-white rounded-full p-1 shadow-md"
                                                            title="Praktikum löschen"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                        <InternshipCard internship={internship} />
                                                    </div>
                                                </FadeIn>
                                            ))}
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
                                                            Keine Praktia entsprechen deiner Suche nach "{searchTerm}".
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