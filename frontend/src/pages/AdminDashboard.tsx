import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { Building,   BriefcaseBusiness} from 'lucide-react';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  // Placeholder values for now
  const outstandingVerifications = 5;
  const [newInternships, setNewInternships] = useState(0);

  useEffect(() => {
    const fetchInternships = async () => {
      const res = await fetch('http://localhost:5000/api/internship/created/last30days');
      const data = await res.json();
      setNewInternships(data.count);
    };
    fetchInternships();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex justify-center">
        <main className="w-full max-w-7xl p-8">
          <FadeIn>
            <div className="flex flex-col gap-2">
              <h1 className="heading-md">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Übersicht über das Praktikumsportal.
              </p>
            </div>
          </FadeIn>
          <div className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FadeIn delay={100}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Offene Unternehmens-Verifizierungen</CardTitle>
                    <CardDescription>Zu prüfende Unternehmen</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Building className="h-8 w-8 text-primary mr-3" />
                      <div className="text-3xl font-semibold">{outstandingVerifications}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
              <FadeIn delay={150}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Neue Praktika</CardTitle>
                    <CardDescription>Letzte 30 Tage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <BriefcaseBusiness className="h-8 w-8 text-primary mr-3" />
                      <div className="text-3xl font-semibold">{newInternships}</div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 