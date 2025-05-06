import { Link } from 'react-router-dom';
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
  Calendar,
  Clock,
  GraduationCap,
  Briefcase,
  BookmarkPlus,
  Share,
  FileText,
  Mail
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



// falls ein Praktikum für mehrere Abteilungen gedacht ist
const formatDepartment = (department: string | string[]): string => {
  if (Array.isArray(department)) {
    return department.join(', ');
  }
  return department;
};

const internship = {
  id: '2',
  title: 'Marketing Assistent',
  company: 'LT-Studios',
  location: 'Graz',
  duration: '6 Wochen',
  deadline: '2025-04-30',
  added: '2025-03-29',
  clicks: 89,
  workMode: 'Hybrid',
  logo: '/assets/company-logos/LT-Studios_Logo.png',
  category: ['Medientechnik'],
  schoolYear: '4. Schulstufe',
  companyLink: 'https://random-company.com/ltstudios'
};

const InternshipDescription = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container-xl">
          <FadeIn>
            <div className="mb-6">
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
                  {internship.logo ? (
                    <div className="h-16 w-16 mr-4 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                      <img
                        src={internship.logo}
                        alt={`${internship.company} Logo`}
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
                      <span className="font-medium">{internship.company}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {internship.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <BookmarkPlus className="h-4 w-4" />
                    Speichern
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share className="h-4 w-4" />
                    Teilen
                  </Button>
                  <Button asChild>
                    <Link to={`/internships/${internship.id}/apply`} className="flex items-center gap-2">
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
              <Document file={`public/job_postings/${internship.id}.pdf`}>
                <Page pageNumber={1} className="w-full h-auto" scale={1.2}/>
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
                      <span className="font-medium">{formatDepartment(internship.category)}</span>
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
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Startdatum</span>
                      </div>
                      <span className="font-medium">10.04.2025</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <div className="flex items-center text-muted-foreground">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span>Vergütung</span>
                      </div>
                      <span className="font-medium">1000€</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b">
                      <div className="flex items-center text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Bewerbungsfrist</span>
                      </div>
                      <span className="font-medium">{internship.deadline}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-muted-foreground">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span>Mindest-Schulstufe</span>
                      </div>
                      <span className="font-medium">{internship.schoolYear}</span>
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
                      {internship.logo ? (
                        <div className="h-12 w-12 mr-3 rounded-md overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                          <img
                            src={internship.logo}
                            alt={`${internship.company} Logo`}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 mr-3 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <Building className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{internship.company}</h3>
                        <p className="text-sm text-muted-foreground">{internship.location}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {internship.company} Unternehmen in Leonding, Linz mit dem Fokus auf IT-Produkte.
                    </p>

                    <Button variant="outline" className="w-full">
                      Unternehmenswebsite besuchen
                    </Button>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InternshipDescription;