import React from 'react';
import {Search, Filter, ChevronDown, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

const CATEGORIES = ['Alle', 'Informatik', 'Medientechnik', 'Medizintechnik', 'Elektronik'];
const WORK_MODE = ['Alle', 'Remote', 'Hybrid', 'On-Site'];
const DURATIONS = ['Alle', '4 Wochen', '6 Wochen', '8 Wochen', 'variabel'];
const SCHOOL_YEARS = ['Alle Schulstufen', '2. Schulstufe', '3. Schulstufe', '4. Schulstufe'];

type Props = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    selectedWorkMode: string;
    setSelectedWorkMode: (value: string) => void;
    selectedDuration: string;
    setSelectedDuration: (value: string) => void;
    selectedSchoolYear: string;
    setSelectedSchoolYear: (value: string) => void;
    filtersVisible: boolean;
    setFiltersVisible: (value: boolean) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
};

const InternshipFilter: React.FC<Props> = ({
                                                searchTerm,
                                                setSearchTerm,
                                                selectedCategory,
                                                setSelectedCategory,
                                                selectedWorkMode,
                                                setSelectedWorkMode,
                                                selectedDuration,
                                                setSelectedDuration,
                                                selectedSchoolYear,
                                                setSelectedSchoolYear,
                                                filtersVisible,
                                                setFiltersVisible,
                                                clearFilters,
                                                hasActiveFilters
                                            }) => {
    return (
        <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Nach Praktika oder Unternehmen suchen..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" onClick={() => setFiltersVisible(!filtersVisible)}
                        className="md:w-auto flex items-center justify-center">
                    <Filter className="h-4 w-4 mr-2"/>
                    Filter
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${filtersVisible ? 'rotate-180' : ''}`}/>
                </Button>
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters}
                            className="md:w-auto flex items-center justify-center">
                        <X className="h-4 w-4 mr-2"/>
                        Filter zurücksetzen
                    </Button>
                )}
            </div>

            {filtersVisible && (
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-border shadow-subtle ">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Abteilung</label>
                            <select
                                className="w-full rounded-lg border border-input p-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-background text-foreground"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Standort</label>
                            <select
                                className="w-full rounded-lg border border-input p-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-background text-foreground"
                                value={selectedWorkMode}
                                onChange={(e) => setSelectedWorkMode(e.target.value)}
                            >
                                {WORK_MODE.map((mode) => (
                                    <option key={mode} value={mode}>{mode}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Dauer</label>
                            <select
                                className="w-full rounded-lg border border-input p-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-background text-foreground"
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                            >
                                {DURATIONS.map((duration) => (
                                    <option key={duration} value={duration}>{duration}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Mindest-Schulstufe</label>
                            <select
                                className="w-full rounded-lg border border-input p-2 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none bg-background text-foreground"
                                value={selectedSchoolYear}
                                onChange={(e) => setSelectedSchoolYear(e.target.value)}
                            >
                                {SCHOOL_YEARS.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default InternshipFilter;
