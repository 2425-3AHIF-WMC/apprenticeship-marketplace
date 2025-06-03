import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  GraduationCap,
  Briefcase,
  BookmarkPlus,
  Share,
  FileText,
  Mail,
  Euro,
  BookmarkCheck,
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { InternshipDetailsUIProps } from '@/utils/interfaces';
import { cn, mapBackendToInternshipDetailsProps } from '@/utils/utils';
import { useEffect, useState } from 'react';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorIndicator from '@/components/ErrorIndicator';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/authUtils';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



// falls ein Praktikum für mehrere Abteilungen gedacht ist
const formatDepartment = (department: string | string[]): string => {
  if (Array.isArray(department)) {
    return department.join(', ');
  }
  return department;
};



const InternshipDescription = () => {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const [internship, setInternship] = useState<InternshipDetailsUIProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const { studentId } = useAuth();
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    if (studentId) {
        isAdmin(studentId).then((result) => {
            if (mounted) setIsAdminUser(result);
        });
    } else {
        setIsAdminUser(false);
    }
    return () => { mounted = false; };
}, [studentId]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    const fetchInternship = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!id) throw new Error('Keine Praktikums-ID in der URL gefunden');
        const res = await fetch(`http://localhost:5000/api/internship/${id}`);
        if (!res.ok) throw new Error('Fehler beim Laden des Praktikas');
        const data = await res.json();
        setInternship(mapBackendToInternshipDetailsProps(data));
      } catch (err: any) {
        setError(err.message || 'Unbekannter Fehler');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInternship();
  }, [id]);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!studentId) return;
      const res = await fetch(`http://localhost:5000/api/student/favourites/${studentId}`);
      if (!res.ok) return;
      const favIds = await res.json();
      setFavouriteIds(favIds);
      setIsFavourite(favIds.includes(Number(id)));
    };
    fetchFavourites();
  }, [studentId]);

  useEffect(() => {
    const fetchViewed = async () => {
      if (!studentId || !internship?.id) return;
      const res = await fetch(`http://localhost:5000/api/viewed_internship/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: studentId, internshipId: internship.id })
      });
      if (!res.ok) return;
    };
    fetchViewed();
  }, [studentId, internship?.id]);

  const handleToggleFavourite = async (internshipId: number) => {
    if (!studentId) return;
    const isFav = favouriteIds.includes(internshipId);
    if (isFav) {
      // Remove favourite
      await fetch('http://localhost:5000/api/favourite/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, internship_id: internshipId })
      });
      setFavouriteIds((prev) => prev.filter((id) => id !== internshipId));
      setIsFavourite(false);
    } else {
      // Add favourite
      await fetch('http://localhost:5000/api/favourite/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, internship_id: internshipId })
      });
      setFavouriteIds((prev) => [...prev, internshipId]);
      setIsFavourite(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        {isLoading ? (
          <LoadingIndicator message="Lade Praktika..." />
        ) : error ? (
          <ErrorIndicator message="Fehler beim Laden der Praktika" error={error} />
        ) : internship ? (
          <div className="container-xl">

            <FadeIn>
              <div className="mb-6 text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-4"
                  asChild
                >
                  <Link to="/internships" className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück zu Praktika
                  </Link>
                </Button>

                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex items-center">
                    {internship.company_logo ? (
                      <div className="h-16 w-16 mr-4 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <img
                          src={`http://localhost:5000/api/media/${internship.company_logo}`}
                          alt={`${internship.company_name} Logo`}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 mr-4 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Building className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <h1 className="heading-md">{internship.title}</h1>
                      <div className="flex items-center text-muted-foreground">
                        <span className="font-medium">{internship.company_name}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {internship.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                  { studentId && !isAdminUser && <Button variant="outline" className={cn("flex items-center gap-2", isFavourite ? "bg-primary/10 text-primary hover:bg-primary/20 dark:hover:bg-primary/20 dark:hover:text-primary" : "")} 
                    onClick={() => handleToggleFavourite(Number(internship.id))}>
                      {isFavourite ? (
                        <BookmarkCheck className="h-5 w-5" />
                      ) : (
                        <BookmarkPlus className="h-5 w-5" /> 
                      )} {isFavourite ? 'Gespeichert' : 'Speichern'}
                    </Button>
}
                    <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
                      <Share className="h-4 w-4" />
                      {copied ? 'Link kopiert!' : 'Teilen'}
                    </Button>
                    <Button asChild>
                      <Link to={internship.internship_link} className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Jetzt bewerben
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2 overflow-x-auto ">
                <Document file={`http://localhost:5000/api/media/${internship.pdf}`}>
                  <Page pageNumber={1} className="w-full h-auto" scale={1.2} />
                </Document>
              </div>



              <div className="space-y-6">
                <FadeIn delay={150}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Kurzinfos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center text-muted-foreground">
                          <Briefcase className="h-4 w-4 mr-2" />
                          <span>Abteilung</span>
                        </div>
                        <span className="font-medium text-right">{formatDepartment(internship.category)}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Standort</span>
                        </div>
                        <span className="font-medium">{internship.location}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Dauer</span>
                        </div>
                        <span className="font-medium">{internship.duration}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center text-muted-foreground">
                          <Euro className="h-4 w-4 mr-2" />
                          <span>Gehalt</span>
                        </div>
                        <span className="font-medium">{internship.salary}</span>
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center text-muted-foreground">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Bewerbungsfrist</span>
                        </div>
                        <span className="font-medium">{internship.application_end}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-muted-foreground">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          <span>Mindest-Schulstufe</span>
                        </div>
                        <span className="font-medium">{internship.min_year}</span>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>

                <FadeIn delay={200}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Unternehmensinformation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        {internship.company_logo ? (
                          <div className="h-12 w-12 mr-3 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <img
                              src={`http://localhost:5000/api/media/${internship.company_logo}`}
                              alt={`${internship.company_name} Logo`}
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 mr-3 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                            <Building className="h-6 w-6" />
                          </div>
                        )}
                        <div className="text-left">
                          <h3 className="font-semibold">{internship.company_name}</h3>
                          <p className="text-sm text-muted-foreground">{internship.location}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {internship.company_info}
                      </p>
                      <Button variant="outline" className="w-full">
                        <Link to={internship.company_link}>
                          Unternehmenswebsite besuchen
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to={`/companies/${internship.company_id}`}>
                          Unternehmensinformationen
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};

export default InternshipDescription;