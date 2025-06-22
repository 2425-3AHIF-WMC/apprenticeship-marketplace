import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    FilePlus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Clock,
    MapPin, Star
} from 'lucide-react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { toast, Toaster } from 'sonner';
import FadeIn from '@/components/FadeIn';
import LoadingIndicator from '@/components/LoadingIndicator';
import CompanyDashboardSidebar from "@/components/CompanyDashboardSidebar.tsx";
import { InternshipMappedProps, InternshipUIProps } from "@/utils/interfaces.ts";
import { cn } from '@/utils/utils';


const CompanyInternships = () => {
    const [internships, setInternships] = useState<InternshipUIProps[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<number | null>(null);
    const departmentIncludesSearchTerm = (category: string | string[], term: string): boolean => {
        if (Array.isArray(category)) {
            return category.some(cat => cat.toLowerCase().includes(term.toLowerCase()));
        }
        return category.toLowerCase().includes(term.toLowerCase());
    };

    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        return new Intl.DateTimeFormat('de-DE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const isDeadlineExpired = (deadline: string) => {
        if (!deadline) return true;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) return false; // Invalid date, treat as not expired
        today.setHours(0,0,0,0);
        deadlineDate.setHours(0,0,0,0);
        return deadlineDate < today;
    };

    useEffect(() => {
        const fetchInternships = async () => {
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
                const withFavourites = await Promise.all(
                    data.map(async (item: InternshipMappedProps) => {
                        let favourite_count = 0;
                        try {
                            const favRes = await fetch(`http://localhost:5000/api/student/favourites/internship/${item.internship_id}`);
                            if (favRes.ok) {
                                favourite_count = await favRes.json();
                            }
                        } catch {}
                        return {
                            ...item,
                            id: item.internship_id,
                            department: item.category,
                            favourite_count
                        } as InternshipUIProps & { favourite_count: number };
                    })
                );
                setInternships(withFavourites);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
                toast.error('Fehler beim Laden der Praktika');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInternships();
    }, [companyId]);


    const handleDeleteInternship = async (id: string) => {
        try {
            const token = localStorage.getItem('companyAccessToken');
            if (!token) {
                throw new Error('Kein Zugriffstoken gefunden');
            }
            console.log(id);
            const response = await fetch(`http://localhost:5000/api/internship/delete/${id}`, {
                method: 'DELETE'
            });
            console.log(response.status)
            if (!response.ok) {
                throw new Error('Fehler beim Löschen des Praktikums');
            }

            setInternships(prev => prev.filter(internship => internship.id !== id));
            toast.success("Praktikum erfolgreich gelöscht");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Fehler beim Löschen');
        }
    };

    const filteredInternships = internships.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        departmentIncludesSearchTerm(internship.department, searchTerm) ||
        internship.location.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const getCategoryClasses = (category: string) => {
        return `tag-${category}`;
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen">
                <CompanyDashboardSidebar />
                <div className="flex-1 flex justify-center">
                    <main className="w-full p-8 space-y-8">

                        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                            <LoadingIndicator />
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen">
                <CompanyDashboardSidebar />
                <div className="flex-1 flex justify-center">
                    <main className="w-full p-8 space-y-8">

                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                                <FilePlus className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Fehler beim Laden</h3>
                            <p className="text-muted-foreground mb-4 max-w-md">
                                {error}
                            </p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Erneut versuchen
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Toaster richColors position="top-center" closeButton />
            <CompanyDashboardSidebar />
            <div className="flex-1 flex justify-center">
                <main className="w-full p-8 space-y-8 ">
                    <FadeIn direction="up" delay={50}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="heading-md">Meine Praktikumsangebote</h1>
                                <p className="text-muted-foreground">
                                    Verwalten Sie alle Ihre Praktikumsausschreibungen.
                                </p>
                            </div>
                            <Button asChild>
                                <Link to="/company/internship/create">
                                    <FilePlus className="h-4 w-4 mr-2" />
                                    Praktikum erstellen
                                </Link>
                            </Button>
                        </div>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="text-left">
                                        <CardTitle>Praktikumsangebote</CardTitle>
                                        <CardDescription>
                                            {filteredInternships.length} Praktika gefunden
                                        </CardDescription>
                                    </div>
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Suchen..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredInternships.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Titel</TableHead>
                                                <TableHead>Abteilung(en)</TableHead>
                                                <TableHead>Standort</TableHead>
                                                <TableHead>Bewerbungsfrist</TableHead>
                                                <TableHead>Favorisiert</TableHead>
                                                <TableHead className="text-right">Aktionen</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredInternships.map((internship) => (
                                                <TableRow key={internship.id} className={isDeadlineExpired(internship.application_end) ? 'bg-gray-100 dark:bg-black/20 text-muted-foreground' : ''}>
                                                    <TableCell className="font-medium">{internship.title}
                                                        {isDeadlineExpired(internship.application_end) && (
                                                            <span className="ml-2 text-xs text-red-500">(Abgelaufen)</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-2">
                                                            {internship.department.map((dep, index) => (
                                                                <span
                                                                    key={`${dep}-${index}`}
                                                                    className={cn(
                                                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                                                        getCategoryClasses(dep)
                                                                    )}
                                                                >
                                                                    {dep}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <MapPin className="h-3.5 w-3.5 mr-1" />
                                                            {internship.location || 'Remote'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <Clock className="h-3.5 w-3.5 mr-1" />
                                                            {formatDate(internship.application_end)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center text-muted-foreground">
                                                            <Star className="h-3.5 w-3.5 mr-1" />
                                                            {(internship as any).favourite_count ?? 0}x gemerkt
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link to={`/internships/${internship.id}`} state={{ backPath: '/company/internships' }} className="cursor-pointer">
                                                                        <Eye className="h-4 w-4 mr-2" />
                                                                        <span>Ansehen</span>
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Link
                                                                        to="/company/internship/create"
                                                                        state={{ updating: true, internshipId: internship.id }}
                                                                        className="cursor-pointer">
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        <span>Bearbeiten</span>
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive cursor-pointer">
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            <span>Löschen</span>
                                                                        </DropdownMenuItem>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="text-center">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Praktikum löschen</DialogTitle>
                                                                            <DialogDescription>
                                                                                Sind Sie sicher, dass Sie dieses Praktikum löschen möchten?
                                                                                Diese Aktion kann nicht rückgängig gemacht werden.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter className="flex justify-center gap-4">
                                                                            <DialogClose asChild>
                                                                                <Button variant="outline">Abbrechen</Button>
                                                                            </DialogClose>
                                                                            <Button
                                                                                variant="destructive"
                                                                                onClick={() => handleDeleteInternship(internship.id)}
                                                                            >
                                                                                Löschen
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                                            <FilePlus className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        {searchTerm ? (
                                            <>
                                                <h3 className="text-lg font-medium mb-2">Keine Ergebnisse gefunden</h3>
                                                <p className="text-muted-foreground mb-4 max-w-md">
                                                    Es wurden keine Praktika gefunden, die Ihrem Suchbegriff "{searchTerm}" entsprechen.
                                                    Versuchen Sie einen anderen Suchbegriff.
                                                </p>
                                                <Button variant="outline" onClick={() => setSearchTerm('')}>
                                                    Suche zurücksetzen
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-lg font-medium mb-2">Keine Praktika vorhanden</h3>
                                                <p className="text-muted-foreground mb-4 max-w-md">
                                                    Sie haben noch keine Praktikumsangebote erstellt. Erstellen Sie jetzt Ihr erstes Praktikumsangebot!
                                                </p>
                                                <Button asChild>
                                                    <Link to="/company/internship/create">
                                                        <FilePlus className="h-4 w-4 mr-2" />
                                                        Praktikum erstellen
                                                    </Link>
                                                </Button>
                                            </>
                                        )}
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

export default CompanyInternships;