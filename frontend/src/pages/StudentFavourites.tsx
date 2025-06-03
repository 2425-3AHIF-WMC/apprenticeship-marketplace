import { useState, useEffect } from 'react';
import { Search, BriefcaseBusiness } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { InternshipUIProps } from '@/utils/interfaces';
import StudentDashboardSidebar from "@/components/StudentDashboardSidebar.tsx";
import { useAuth } from '@/context/AuthContext';
import { mapBackendToInternshipProps } from '@/utils/utils';
import InternshipFilter from '@/components/InternshipFilter';
import InternshipCard from '@/components/InternshipCard';
import { filterInternships, InternshipFilterOptions } from '@/utils/utils';
import { getYearNumber } from '@/utils/filterUtils';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorIndicator from '@/components/ErrorIndicator';

const StudentFavourites = () => {
    const [favoriteInternships, setFavoriteInternships] = useState<InternshipUIProps[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { studentId } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('Alle');
    const [selectedWorkMode, setSelectedWorkMode] = useState('Alle');
    const [selectedDuration, setSelectedDuration] = useState('Alle');
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('Alle Schulstufen');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [sortBy, setSortBy] = useState('Nichts');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavourites = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (!studentId) return;
                const res = await fetch(`http://localhost:5000/api/student/favourites_detailed/${studentId}`);
                if (!res.ok) throw new Error('Fehler beim Laden der Favoriten');
                const data = await res.json();
                setFavoriteInternships(Array.isArray(data) ? data.map(mapBackendToInternshipProps) : []);
            } catch (err: any) {
                setError(err.message || 'Unbekannter Fehler');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFavourites();
    }, [studentId]);


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

    // Pre-filter out expired internships
    const validInternships = favoriteInternships.filter((internship) => {
        const deadlineDate = new Date(internship.application_end);
        const today = new Date();
        return !isNaN(deadlineDate.getTime()) && deadlineDate >= today;
    });

    // Use shared filter utility
    const filterOptions: InternshipFilterOptions = {
        searchTerm,
        selectedCategory,
        selectedWorkMode,
        selectedDuration,
        selectedSchoolYear,
    };
    let filteredInternships = filterInternships(validInternships, filterOptions);

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
        // Sortierfunktion für das gewählte Kriterium
        const sortFn = (a: InternshipUIProps, b: InternshipUIProps) => {
            if (sortBy === 'Bewerbungsfrist') {
                return new Date(a.application_end).getTime() - new Date(b.application_end).getTime();
            }
            if (sortBy === 'Neueste') {
                return new Date(b.added).getTime() - new Date(a.added).getTime();
            }
            if (sortBy === 'Beliebteste') {
                return b.views - a.views;
            }
            return 0;
        };
        filteredInternships = filteredInternships.sort(sortFn);
    }

    const removeFromFavourites = async (internshipId: string) => {
        if (!studentId) return;
            await fetch('http://localhost:5000/api/favourite/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId, internship_id: internshipId })
            });
            setFavoriteInternships((prev) => prev.filter((internship) => internship.id !== internshipId));
        }

    return (
        <div className="flex min-h-screen">
            <StudentDashboardSidebar />
            <div className="flex-1 flex justify-center">
                <main className="w-full p-8 space-y-6 ">
                    <FadeIn>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="heading-md text-left">Meine Favoriten</h1>
                                <p className="text-muted-foreground text-left">
                                    Übersicht deiner Favoriten
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
                                    <span>Favourisierte Praktika</span>
                                </CardTitle>
                                <CardDescription className="text-left flex items-center justify-between">
                                    {filteredInternships.length} {filteredInternships.length === 1 ? 'Praktikum' : 'Praktika'} gespeichert
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
                                    <LoadingIndicator message="Lade Praktika..." />
                                ) : error ? (
                                    <ErrorIndicator message="Fehler beim Laden der Praktika" error={error} />
                                ) :
                                    filteredInternships.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredInternships.map((internship, index) => (
                                                <FadeIn key={internship.id} delay={index * 50}>
                                                    <div
                                                        className="relative"
                                                    >
                                                        <InternshipCard internship={internship} isFavourite={true} onToggleFavourite={() => removeFromFavourites(internship.id)} />
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

export default StudentFavourites;
