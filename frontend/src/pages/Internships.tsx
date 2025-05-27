import {useState, useEffect} from "react";
import {useLocation} from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InternshipCard from '@/components/InternshipCard';
import InternshipFilter from '@/components/InternshipFilter';
import {Search} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { InternshipUIProps } from "@/utils/interfaces";
import { mapBackendToInternshipProps, filterInternships, InternshipFilterOptions } from '@/utils/utils';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorIndicator from '@/components/ErrorIndicator';

const Internships = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchFromQuery = queryParams.get('search') || '';

    const [searchTerm, setSearchTerm] = useState(searchFromQuery);
    const [selectedCategory, setSelectedCategory] = useState('Alle');
    const [selectedWorkMode, setSelectedWorkMode] = useState('Alle');
    const [selectedDuration, setSelectedDuration] = useState('Alle');
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('Alle Schulstufen');
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [sortBy, setSortBy] = useState('Nichts');
    const [internships, setInternships] = useState<InternshipUIProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Pre-filter out expired internships
    const validInternships = internships.filter((internship) => {
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

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>

            <main className="flex-1 pt-16 md:pt-20">
                <section className="py-10 md:py-16 bg-muted/30">
                    <div className="container-xl">
                        <FadeIn>
                            <h1 className="heading-md text-center mb-6">Praktikumsmöglichkeiten durchsuchen</h1>
                        </FadeIn>
                        <FadeIn delay={100}>
                            <p className="text-muted-foreground text-lg text-center max-w-3xl mx-auto mb-8">
                                Finde das perfekte Praktikum, das zu deinen Fähigkeiten, Interessen und Karrierezielen
                                passt
                            </p>
                        </FadeIn>
                        <FadeIn delay={200}>
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
                        </FadeIn>
                    </div>
                </section>

                <section className="py-10 md:py-16">
                    <div className="container-xl">
                        <div
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-xl font-semibold">
                                {filteredInternships.length} {filteredInternships.length === 1 ? 'Praktikum' : 'Praktika'} gefunden
                            </h2>
                            <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">Sortieren nach:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-lg border border-input p-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-background text-foreground"
                                >
                                    <option value="Nichts">Nichts</option>
                                    <option value="Neueste">Neueste</option>
                                    <option value="Bewerbungsfrist">Bewerbungsfrist</option>
                                    <option value="Beliebteste">Beliebteste</option>
                                </select>

                            </div>
                        </div>
                        {isLoading ? (
                            <LoadingIndicator message="Lade Praktika..." />
                        ) : error ? (
                            <ErrorIndicator message="Fehler beim Laden der Praktika" error={error} />
                        ) : filteredInternships.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredInternships.map((internship, index) => (
                                    <FadeIn key={internship.id} delay={index * 50}>
                                        <InternshipCard internship={internship}/>
                                    </FadeIn>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <FadeIn>
                                    <div
                                        className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4">
                                        <Search className="h-8 w-8"/>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Keine Praktika gefunden</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                        Wir konnten keine Praktika finden, die deinen Kriterien entsprechen. Versuche,
                                        deine Filter anzupassen oder andere Suchbegriffe zu verwenden.
                                    </p>
                                </FadeIn>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer/>
        </div>
    );
};

export default Internships;
