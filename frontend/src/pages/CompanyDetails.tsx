import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Mail, Phone, Globe, ArrowLeft } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import InternshipCard from '@/components/InternshipCard';
import { CompanyUIProps, InternshipUIProps } from '@/utils/interfaces';

// Mock company data
const company: CompanyUIProps = {
  company_id: 1,
  company_name: 'LT-Studios',
  company_info: 'LT-Studios ist ein innovatives Unternehmen mit Fokus auf Medientechnik und Informatik. Wir bieten spannende Praktika für Schüler:innen und Studierende.',
  website: 'https://ltstudios.at',
  email: 'kontakt@ltstudios.at',
  phone_number: '+43 987 654321',
  password: '',
  company_logo: '/assets/company-logos/LT-Studios_Logo.png',
  company_number: 'LT-12345',
  internships: [2, 3],
};

// Mock internships for this company
const internships: InternshipUIProps[] = [
  {
    id: '2',
    title: 'Marketing Assistent',
    company_name: 'LT-Studios',
    application_end: '2025-07-30',
    min_year: '4. Schulstufe',
    location: 'Graz',
    work_type: 'Hybrid',
    company_logo: '/assets/company-logos/LT-Studios_Logo.png',
    duration: '6 Wochen',
    added: '2025-03-29',
    views: 89,
    department: ['Medientechnik', 'Informatik'],
    company_link: 'https://ltstudios.at',
    internship_link: 'https://ltstudios.at/internship/2',
  },
  {
    id: '3',
    title: 'Software Developer Praktikum',
    company_name: 'LT-Studios',
    application_end: '2025-08-15',
    min_year: '3. Schulstufe',
    location: 'Linz',
    work_type: 'Vor Ort',
    company_logo: '/assets/company-logos/LT-Studios_Logo.png',
    duration: '8 Wochen',
    added: '2025-04-01',
    views: 120,
    department: ['Informatik'],
    company_link: 'https://ltstudios.at',
    internship_link: 'https://ltstudios.at/internship/3',
  },
];

const CompanyDetails = () => {
  // const { id } = useParams();
  // TODO: Fetch company and internships by id

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container-xl">
          <FadeIn>
            <div className="mb-6 text-left">
            
              <div className="flex items-start gap-6 flex-wrap">
                {company.company_logo ? (
                  <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                    <img
                      src={company.company_logo}
                      alt={`${company.company_name} Logo`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Building className="h-10 w-10" />
                  </div>
                )}
                <div>
                  <h1 className="heading-md mb-2">{company.company_name}</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDetails;
