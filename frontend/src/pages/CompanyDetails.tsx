import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Mail, Phone, Globe, Search} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import InternshipCard from '@/components/InternshipCard';
import { CompanyUIPropsAdmin, InternshipUIProps } from '@/utils/interfaces';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mapBackendToCompanyUIPropsAdmin, mapBackendToInternshipProps } from '@/utils/utils';

const CompanyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const [company, setCompany] = useState<CompanyUIPropsAdmin | null>(null);
  const [companyLoading, setCompanyLoading] = useState(!state?.company);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const [internships, setInternships] = useState<InternshipUIProps[]>([]);
  const [internshipsLoading, setInternshipsLoading] = useState(true);
  const [internshipsError, setInternshipsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      setCompanyLoading(true);
      setCompanyError(null);
      try {
        if (!id) throw new Error('Keine Unternehmens-ID in der URL gefunden');
        const res = await fetch(`http://localhost:5000/api/company/${id}`);
        if (!res.ok) throw new Error('Fehler beim Laden des Unternehmens');
        const data = await res.json();
        setCompany(mapBackendToCompanyUIPropsAdmin(data));
      } catch (err: any) {
        setCompanyError(err.message || 'Unbekannter Fehler');
      } finally {
        setCompanyLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  useEffect(() => {
    if (!company) return;
    setInternshipsLoading(true);
    setInternshipsError(null);
    fetch(`http://localhost:5000/api/company/${id}/internships`)
      .then(res => {
        if (!res.ok) throw new Error('Fehler beim Laden der Praktika');
        return res.json();
      })
      .then(data => {
        console.log(data);
        setInternships(Array.isArray(data) ? data.map(mapBackendToInternshipProps) : []);
      })
      .catch(err => setInternshipsError(err.message || 'Unbekannter Fehler'))
      .finally(() => setInternshipsLoading(false));
  }, [company]);


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
      {companyLoading ? (
          <div className="text-center py-20">
            <FadeIn>
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lade Unternehmen...</h3>
            </FadeIn>
          </div>
        ) : companyError ? (
          <div className="text-center py-20">
            <FadeIn>
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fehler beim Laden des Unternehmens</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">{companyError}</p>
            </FadeIn>
          </div>
        ) : ( company && (
        <div className="container-xl">
          <FadeIn>
            <div className="mb-6 text-left">
              <div className="flex items-start gap-6 flex-wrap">
                {company.company_logo ? (
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <img
                      src={company.company_logo}
                      alt={`${company.name} Logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Building className="h-10 w-10" />
                  </div>
                )}
                <div>
                  <h1 className="heading-md mb-2">{company.name}</h1>
                  <div className="flex flex-col gap-1 text-muted-foreground">
                    <span className="flex items-center text-xs text-muted-foreground">Firmenbuchnummer: {company.company_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 lg:min-h-[200px]">
            <div className="lg:col-span-2 flex flex-col h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Unternehmensbeschreibung</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-base text-muted-foreground whitespace-pre-line flex-1">{company.company_info}</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6 flex flex-col h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex flex-col h-full">
                  <div className="flex items-center"><Mail className="h-4 w-4 mr-2" />{company.email}</div>
                  <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{company.phone_number}</div>
                  <div className="flex items-center"><Globe className="h-4 w-4 mr-2" /><a href={company.website} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">{company.website}</a></div>
                </CardContent>
              </Card>
            </div>
          </div>

          <FadeIn delay={100}>
            <h2 className="heading-md mb-4">Praktika dieses Unternehmens</h2>
            {internshipsLoading ? (
              <div className="text-center py-10">
                <FadeIn>
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Lade Praktika...</h3>
                </FadeIn>
              </div>
            ) : internshipsError ? (
              <div className="text-center py-10">
                <FadeIn>
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fehler beim Laden der Praktika</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">{internshipsError}</p>
                </FadeIn>
              </div>
            ) : internships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {internships.map((internship, index) => (
                      <FadeIn key={internship.id} delay={index * 50}>
                          <InternshipCard internship={internship}/>
                      </FadeIn>
                  ))}
              </div>
          ) : (
              <div className="text-center py-20">
                  <FadeIn>
                      <div
                          className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4">
                          <Search className="h-8 w-8"/>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Keine Praktika gefunden</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Wir konnten keine Praktika finden, die deinen Kriterien entsprechen. Versuche,
                          deine Filter anzupassen oder andere Suchbegriffe zu verwenden.
                      </p>
                  </FadeIn>
              </div>
          )}
          </FadeIn>
        </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDetails;
