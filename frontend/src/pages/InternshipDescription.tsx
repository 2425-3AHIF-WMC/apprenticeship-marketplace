import {  Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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

// falls ein Praktika für mehrere Abteilungen gedacht ist
const formatDepartment = (department: string | string[]): string => {
  if (Array.isArray(department)) {
    return department.join(', ');
  }
  return department;
};

const internship = {
    id: "1",
    title: "Softwareentwickler Praktikum",
    company: "IT GmbH",
    location: "Leonding, Österreich",
    logo: "https://media.istockphoto.com/id/2148178472/photo/hispanic-programmers-collaborating-on-software-development-in-a-modern-office-setting.webp?s=2048x2048&w=is&k=20&c=FLE4P6Li6CGy86zeHib-ST8q39D0jSUWRpMOEFF82Y4=",
    description: "Ein spannendes Praktikum im Bereich Softwareentwicklung, bei dem du praktische Erfahrungen sammeln kannst.",
    startDate: "01.03.2024",
    duration: "6 Monate",
    positions: 3,
    applyBy: "15.02.2024",
    responsibilities: [
        "Entwicklung und Wartung von Webanwendungen.",
        "Zusammenarbeit mit dem Entwicklungsteam zur Implementierung neuer Features.",
        "Fehlerbehebung und Optimierung bestehender Anwendungen."
    ],
    requirements: [
        "Grundkenntnisse in JavaScript, HTML und CSS.",
        "Erfahrung mit React ist von Vorteil.",
        "Gute Kommunikations- und Teamfähigkeiten."
    ],
    benefits: [
        "Flexible Arbeitszeiten.",
        "Möglichkeit zur Übernahme nach dem Praktikum.",
        "Kostenlose Getränke und Snacks."
    ],
    department: ["Medientechnik", "Informatik"],
    salary: "1.250 EUR/Monat",
    deadline: "15.06.2026",
    schoolYear: "11. Schulstufe"
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
              <div className="lg:col-span-2">
                <FadeIn delay={100}>
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Überblick</CardTitle>
                      <CardDescription>
                        Wichtige Informationen zu diesem Praktikumsangebot
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg mb-6">{internship.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Startdatum</h3>
                            <p className="text-muted-foreground">{internship.startDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Dauer</h3>
                            <p className="text-muted-foreground">{internship.duration}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Verfügbare Plätze</h3>
                            <p className="text-muted-foreground">{internship.positions}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Bewerbungsfrist</h3>
                            <p className="text-muted-foreground">{internship.applyBy}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="text-left">
                          <h3 className="text-lg font-semibold mb-3">Aufgaben</h3>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                          {internship.responsibilities.map((responsibility: string, index: number) => (
                            <li key={index}>{responsibility}</li>
                          ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Anforderungen</h3>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {internship.requirements.map((requirement: string, index: number) => (
                              <li key={index} className="text-left">{requirement}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Vorteile</h3>
                          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {internship.benefits.map((benefit: string, index: number) => (
                                <li key={index} className="text-left">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
                

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
                        <span className="font-medium">{formatDepartment(internship.department)}</span>
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
                        <span className="font-medium">{internship.startDate}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b">
                        <div className="flex items-center text-muted-foreground">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          <span>Vergütung</span>
                        </div>
                        <span className="font-medium">{internship.salary}</span>
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