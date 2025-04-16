import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, Search, Calendar, FileText, FileCheck } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { InternshipProps } from '@/components/InternshipCard';
import { useAuth } from '@/context/AuthContext';
import StudentDashboardSidebar from '@/components/StudentDashboardSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const StudentDashboard = () => {
  const [favoriteInternships] = useState<InternshipProps[]>([]);
  const { studentName } = useAuth();
  const isMobile = useIsMobile();


  // TODO: Implement the following:
  // - Fetch the student's favorites from the backend
  // - Fetch the student's applications from the backend
  // - Fetch the student's upcoming deadlines from the backend
  // - Fetch the student's statistics from the backend
  // - Fetch the student's profile information from the backend
  useEffect(() => {    
    
  }, []);

  // Beispielstatistiken
  const viewedCount = Math.floor(Math.random() * 20) + 5;
  
  return (
    <div className="flex min-h-screen">
      <StudentDashboardSidebar />
      <div className="flex-1 flex justify-center">
        <main className="w-full max-w-7xl p-8">
          <FadeIn>
            <div className="flex flex-col gap-2">
              <h1 className="heading-md">Willkommen, {studentName}!</h1>
              <p className="text-muted-foreground">
                Hier findest du eine Übersicht über deine favorisierten Praktika und Bewerbungen.
              </p>
            </div>
          </FadeIn>
          
          <div className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FadeIn delay={100}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Favoriten</CardTitle>
                    <CardDescription>Gespeicherte Praktika</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <BookmarkIcon className="h-8 w-8 text-primary mr-3" />
                      <div className="text-3xl font-semibold">{favoriteInternships.length}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
              
              <FadeIn delay={150}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Angesehene Praktika</CardTitle>
                    <CardDescription>Letzte 30 Tage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Search className="h-8 w-8 text-primary mr-3" />
                      <div className="text-3xl font-semibold">{viewedCount}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
        
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <FadeIn delay={200}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Meine Favoriten</CardTitle>
                        <CardDescription>Praktika, die du gespeichert hast</CardDescription>
                      </div>
                      <Button asChild>
                        <Link to="/schueler/favoriten">
                          <BookmarkIcon className="h-4 w-4 md:mr-2" />
                          {!isMobile && "Alle anzeigen"}
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {favoriteInternships.length > 0 ? (
                        <div className="space-y-4">
                          {favoriteInternships.slice(0, 3).map((internship) => (
                            <div key={internship.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col">
                                <h3 className="font-medium">{internship.title}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  <span>Bewerbungsfrist: {internship.deadline}</span>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/internships/${internship.id}`}>
                                  Details
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
                            <BookmarkIcon className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Keine Favoriten vorhanden</h3>
                          <p className="text-muted-foreground mb-4">Du hast noch keine Praktika als Favoriten gespeichert.</p>
                          <Button asChild>
                            <Link to="/internships">Praktika durchsuchen</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
              
              <div>
                <FadeIn delay={250}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Schnellzugriff</CardTitle>
                      <CardDescription>Häufig verwendete Aktionen</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/internships">
                          <Search className="h-4 w-4 mr-2" />
                          Praktika durchsuchen
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/schueler/favoriten">
                          <BookmarkIcon className="h-4 w-4 mr-2" />
                          Favoriten verwalten
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link to="/schueler/bewerbungen">
                          <FileCheck className="h-4 w-4 mr-2" />
                          Bewerbungen prüfen
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </FadeIn>
                
                <FadeIn delay={300}>
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Nächste Bewerbungsfristen</CardTitle>
                      <CardDescription>Bevorstehende Fristen deiner Favoriten</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {favoriteInternships.length > 0 ? (
                        <ul className="space-y-3">
                          {favoriteInternships
                            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                            .slice(0, 3)
                            .map((internship) => (
                              <li key={internship.id} className="flex justify-between items-center text-sm">
                                <span className="font-medium">{internship.title}</span>
                                <span className="text-muted-foreground">{internship.deadline}</span>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          Keine favorisierten Praktika vorhanden
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
