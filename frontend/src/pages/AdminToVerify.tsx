import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, XCircle, ShieldCheck, ExternalLink, BookmarkX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import { cn } from '@/lib/utils';
import AdminDashboardSidebar from '@/components/AdminDashboardSidebar';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const ALL_COMPANIES = [
  {
    id: '1',
    name: 'CarlaCo Enterprises',
    email: 'info@carlaco.com',
    website: 'https://carlaco.com',
    phone_number: '+43 123 456789',
    email_verified: true,
    admin_verified: true,
  },
  {
    id: '2',
    name: 'LT-Studios',
    email: 'kontakt@ltstudios.at',
    website: 'https://ltstudios.at',
    phone_number: '+43 987 654321',
    email_verified: true,
    admin_verified: false,
  },
  {
    id: '3',
    name: 'ITMedia Solutions',
    email: 'office@itmedia.at',
    website: 'https://itmedia.at',
    phone_number: '+43 555 123456',
    email_verified: false,
    admin_verified: false,
  },
  {
    id: '4',
    name: 'Elektronic Design',
    email: 'info@elektronicdesign.at',
    website: 'https://elektronicdesign.at',
    phone_number: '+43 222 333444',
    email_verified: true,
    admin_verified: true,
  },
  {
    id: '5',
    name: 'MeliCorp',
    email: 'kontakt@melicorp.com',
    website: 'https://melicorp.com',
    phone_number: '+43 111 222333',
    email_verified: false,
    admin_verified: false,
  },
];

const getStatus = (company: any) => {
  if (company.admin_verified && company.email_verified) return 'vollständig';
  if (company.email_verified) return 'nur_email';
  return 'keine';
};

const statusStyles = {
  vollständig: 'bg-green-100 text-green-800',
  nur_email: 'bg-yellow-100 text-yellow-800',
  keine: 'bg-red-100 text-red-800',
};

const statusIcons = {
  vollständig: <CheckCircle className="h-5 w-5 text-green-600 mr-1" />, // fully verified
  nur_email: <ShieldCheck className="h-5 w-5 text-yellow-600 mr-1" />, // only email
  keine: <XCircle className="h-5 w-5 text-red-600 mr-1" />, // not verified
};

const statusLabels = {
  vollständig: 'Vollständig verifiziert',
  nur_email: 'Nur E-Mail verifiziert',
  keine: 'Nicht verifiziert',
};

const AdminToVerify = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Only companies that are not fully verified
  const filteredCompanies = ALL_COMPANIES.filter((company) => {
    if (company.admin_verified && company.email_verified || !company.email_verified) return false;
    const term = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(term) ||
      company.email.toLowerCase().includes(term) ||
      company.website.toLowerCase().includes(term) ||
      company.phone_number.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex justify-center">
        <main className="w-full p-8 space-y-6 ">
          <FadeIn>
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="heading-md text-left">Zu verifizierende Unternehmen</h1>
                <p className="text-muted-foreground text-left">
                  Übersicht über alle Unternehmen, die noch verifiziert werden müssen
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Nach Name, E-Mail, Website, Telefon suchen..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Zu verifizierende Unternehmen</span>
                </CardTitle>
                <CardDescription className="text-left">
                  {filteredCompanies.length} Unternehmen gefunden
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredCompanies.length > 0 ? (
                  <div className="space-y-4">
                    {filteredCompanies.map((company) => {
                      const status = getStatus(company);
                      return (
                        <div
                          key={company.id}
                          className={cn(
                            'flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg transition-colors',
                            status === 'vollständig' && 'bg-green-50',
                            status === 'nur_email' && 'bg-yellow-50',
                            status === 'keine' && 'bg-red-50'
                          )}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusStyles[status])}>
                                {statusIcons[status]}
                                {statusLabels[status]}
                              </span>
                            </div>
                            <h3 className="font-semibold text-left text-lg">{company.name}</h3>
                            <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm text-muted-foreground">
                              <span>E-Mail: {company.email}</span>
                              <span>Website: <a href={company.website} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">{company.website}</a></span>
                              <span>Telefon: {company.phone_number}</span>
                            </div>
                          </div>
                          <div className="flex flex-row gap-2 self-end md:self-auto">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/companies/${company.id}`}>
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Details
                              </Link>
                            </Button>
                            {status === 'nur_email' ? (
                              <Button variant="default" size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Akzeptieren
                              </Button>
                            ) : null}
                            <Button variant="destructive" size="sm">
                              <BookmarkX className="h-4 w-4 mr-1" />
                              Entfernen
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted text-muted-foreground mb-4">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Keine Unternehmen gefunden</h3>
                    <p className="text-muted-foreground">
                      Keine Unternehmen entsprechen deiner Suche nach "{searchTerm}".
                    </p>
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

export default AdminToVerify; 