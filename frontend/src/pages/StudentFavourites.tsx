import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, BookmarkX, Search, ExternalLink } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { InternshipUIProps } from '@/utils/interfaces';
import { cn } from '@/lib/utils';
import StudentDashboardSidebar from "@/components/StudentDashboardSidebar.tsx";

const StudentFavourites = () => {
    const [favourites, setFavourites] = useState<InternshipUIProps[]>([]);
    const [searchTerm, setSearchTerm] = useState('');


    // TODO
    // get favourites from backend
    useEffect(() => {

    }, []);

    // TODO
    // delete backend function
    const removeFromFavourites = (id: string) => {
        const updatedFavourites = favourites.filter(favorite => favorite.id !== id);
        setFavourites(updatedFavourites);

    };

    // Helper function to check if a category (string or array) includes a search term
    const categoryIncludesSearchTerm = (category: string | string[], term: string): boolean => {
        if (Array.isArray(category)) {
            return category.some(cat => cat.toLowerCase().includes(term.toLowerCase()));
        }
        return category.toLowerCase().includes(term.toLowerCase());
    };

    const getCategoryClasses = (category: string) => {
        return `tag-${category}`;
    };

    const filteredFavorites = favourites.filter(favorite =>
        favorite.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        favorite.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        favorite.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categoryIncludesSearchTerm(favorite.department, searchTerm)
    );

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
                                    Verwalte deine gespeicherten Praktikumsangebote
                                </p>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Favoriten durchsuchen..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bookmark className="h-5 w-5" />
                                    <span>Favorisierte Praktika</span>
                                </CardTitle>
                                <CardDescription>
                                    {favourites.length === 0
                                        ? "Du hast noch keine Praktika als Favoriten gespeichert."
                                        : `${favourites.length} Praktika gespeichert`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {filteredFavorites.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredFavorites.map((favourite) => (
                                            <div
                                                key={favourite.id}
                                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{favourite.title}</h3>
                                                    <div
                                                        className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-muted-foreground">
                                                        <span>{favourite.company_name}</span>
                                                        <span>{favourite.location}</span>
                                                        <span>Frist: {favourite.application_end}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {Array.isArray(favourite.department) ? (
                                                            favourite.department.map((dep, index) => (
                                                                <span
                                                                    key={`${dep}-${index}`}
                                                                    className={cn(
                                                                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                                        getCategoryClasses(dep)
                                                                    )}
                                                                >
                                                                    {dep}
                                                                </span>

                                                            ))
                                                        ) : (
                                                            <span className={cn(
                                                                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                                                getCategoryClasses(favourite.department)
                                                            )}>
                                                                {favourite.department}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {favourite.work_type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row gap-2 self-end md:self-auto">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link to={`/internships/${favourite.id}`}>
                                                            <ExternalLink className="h-4 w-4 mr-1" />
                                                            Details
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => removeFromFavourites(favourite.id)}
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
                                                        <Bookmark className="h-6 w-6" />
                                                    </div>
                                                    <h3 className="text-lg font-medium mb-2">Keine Favoriten vorhanden</h3>
                                                    <p className="text-muted-foreground mb-4">
                                                        Du hast noch keine Praktika als Favoriten gespeichert.
                                                    </p>
                                                    <Button asChild>
                                                        <Link to="/internships">Praktika durchsuchen</Link>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    )
                                }
                            </CardContent>
                            {
                                favourites.length > 0 && (
                                    <CardFooter className="border-t pt-6 flex justify-center">
                                        <Button asChild variant="outline">
                                            <Link to="/internships">Weitere Praktika durchsuchen</Link>
                                        </Button>
                                    </CardFooter>
                                )
                            }
                        </Card>
                    </FadeIn>
                </main>
            </div>
        </div>
    )
        ;
};

export default StudentFavourites;
