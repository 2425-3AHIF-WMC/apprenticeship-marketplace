import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { Building, BriefcaseBusiness, ShieldCheck, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorIndicator from '@/components/ErrorIndicator';
import { mapBackendToCompanyUIPropsAdmin } from '@/utils/utils';
import { CompanyUIPropsAdmin } from '@/utils/interfaces';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminDashboard = () => {
  // Placeholder values for now
  const [newInternships, setNewInternships] = useState(0);
  const [openAdminVerifications, setOpenAdminVerifications] = useState(0);

  // New state for companies to verify
  const [companies, setCompanies] = useState<CompanyUIPropsAdmin[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchInternships = async () => {
      const res = await fetch('http://localhost:5000/api/internship/created/last30days');
      const data = await res.json();
      setNewInternships(data.count);
    };
    fetchInternships();
  }, []);

  useEffect(() => {
    const fetchOpenAdminVerifications = async () => {
      const res = await fetch('http://localhost:5000/api/company/open_admin_verifications/count');
      const data = await res.json();
      setOpenAdminVerifications(data);
    };
    fetchOpenAdminVerifications();
  }, []);

  // Fetch companies to verify
  useEffect(() => {
    setCompaniesLoading(true);
    setCompaniesError(null);
    fetch('http://localhost:5000/api/company/unverified_admin')
      .then(async (res) => {
        if (!res.ok) throw new Error('Fehler beim Laden der Unternehmen');
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data.map(mapBackendToCompanyUIPropsAdmin) : []);
      })
      .catch((err) => setCompaniesError(err.message || 'Unbekannter Fehler'))
      .finally(() => setCompaniesLoading(false));
  }, []);

  // Sidebar quick access links
  const quickLinks = [
    { to: '/admin/internships', icon: BriefcaseBusiness, label: 'Alle Praktika' },
    { to: '/admin/companies', icon: Building, label: 'Alle Unternehmen' },
    { to: '/admin/companies/verify', icon: ShieldCheck, label: 'Zu Verifizieren' },
    { to: '/internships', icon: Home, label: 'Zurück zu den Praktika' },
  ];

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
                      <div className="text-3xl font-semibold">{openAdminVerifications}</div>
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <FadeIn delay={200}>
                  <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                  <div className="text-left">
                      <CardTitle>Offene Unternehmens-Verifizierungen</CardTitle>
                      <CardDescription>Zu prüfende Unternehmen</CardDescription>
                      </div>
                      <Button asChild>
                        <Link to="/admin/companies/verify">
                          <ShieldCheck className="h-4 w-4 md:mr-2" />
                          {!isMobile && "Alle anzeigen"}
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {companiesLoading ? (
                        <div className="text-center py-8">
                          <LoadingIndicator />
                        </div>
                      ) : companiesError ? (
                        <div className="text-center py-8">
                          <ErrorIndicator message="Fehler beim Laden der Unternehmen" error={companiesError} />
                        </div>
                      ) : companies.length > 0 ? (
                        <div className="space-y-4">
                          {companies.slice(0, 3).map((company: CompanyUIPropsAdmin) => (
                            <div key={company.company_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                              <h3 className="font-medium">{company.name}</h3>
                              <div className="text-muted-foreground">{company.email}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm mb-2">Keine offenen Verifizierungen</div>
                      )}
                    </CardContent>
                  </Card>
                </FadeIn>
              </div>
              <FadeIn delay={250}>
                <Card>
                  <CardHeader>
                    <CardTitle>Schnellzugriff</CardTitle>
                    <CardDescription>Häufig verwendete Aktionen</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quickLinks.map((link) => (
                      <Button
                        key={link.to}
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to={link.to}>
                          <link.icon className="h-4 w-4 mr-2" />
                          {link.label}
                        </Link>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </main>
      </div >
    </div >
  );
};

export default AdminDashboard; 