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
  Mail,
  Euro
} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { InternshipDetailsUIProps } from '@/utils/interfaces';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;



// falls ein Praktikum für mehrere Abteilungen gedacht ist
const formatDepartment = (department: string | string[]): string => {
  if (Array.isArray(department)) {
    return department.join(', ');
  }
  return department;
};

const internship: InternshipDetailsUIProps = {
  id: '2',
  title: 'Marketing Assistent',
  company_name: 'LT-Studios',
  location: 'Graz',
  duration: '6 Wochen',
  application_end: '2025-07-30',
  start_date: '2025-04-10',
  salary: '1000€',
  added: '2025-03-29',
  views: 89,
  work_type: 'Hybrid',
  company_logo: '/assets/company-logos/LT-Studios_Logo.png',
  category: ['Medientechnik', 'Informatik', 'Medizintechnik'],
  min_year: '4. Schulstufe',
  company_link: 'https://random-company.com/ltstudios',
  internship_link: 'https://random-company.com/ltstudios',
  company_id: '3',
  pdf: '/job_postings/2.pdf'
};

const InternshipDescription = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
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
                        src={internship.company_logo}
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <BookmarkPlus className="h-4 w-4" />
                    Speichern
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" onClick={handleShare}>
                    <Share className="h-4 w-4" />
                    {copied ? 'Link kopiert!' : 'Teilen'}
                  </Button>
                  <Button asChild>
                    <Link to={internship.company_link} className="flex items-center gap-2">
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
              <Document file={internship.pdf}>
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
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Startdatum</span>
                      </div>
                      <span className="font-medium">{internship.start_date}</span>
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
                            src={internship.company_logo}
                            alt={`${internship.company_name} Logo`}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 mr-3 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <Building className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{internship.company_name}</h3>
                        <p className="text-sm text-muted-foreground">{internship.location}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {internship.company_name} Unternehmen in Leonding, Linz mit dem Fokus auf IT-Produkte.
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