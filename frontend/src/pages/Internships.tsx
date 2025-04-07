
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InternshipCard, { InternshipProps } from '@/components/InternshipCard';
import { Search } from 'lucide-react';
import FadeIn from '@/components/FadeIn';

// Sample data with multiple categories support
const ALL_INTERNSHIPS: InternshipProps[] = [
    {
        id: '1',
        title: 'Software-Entwicklungs Praktikum',
        company: 'CarlaCo Enterprises',
        location: 'Wien',
        duration: '3 Monate',
        deadline: '15. Mai 2025',
        workMode: 'On-site',
        logo: '/assets/company-logos/CarlaCoEnterprises_Logo.png',
        category: ['Informatik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/carlaco'
    },
    {
        id: '2',
        title: 'Marketing Assistent',
        company: 'LT-Studios',
        location: 'Graz',
        duration: '6 Monate',
        deadline: '30. April 2025',
        workMode: 'Hybrid',
        logo: '/assets/company-logos/LT-Studios_Logo.png',
        category: ['Medientechnik'],
        schoolYear: '4. Schulstufe',
        companyLink: 'https://random-company.com/ltstudios'
    },
    {
        id: '3',
        title: 'UX/UI Design Praktikum',
        company: 'ITMedia Solutions',
        duration: '4 Monate',
        deadline: '5. Mai 2025',
        workMode: 'Remote',
        logo: '/assets/company-logos/ITMediaSolutions_Logo.png',
        category: ['Medientechnik', 'Informatik', 'Medizintechnik', 'Elektronik'],
        schoolYear: '2. Schulstufe',
        companyLink: 'https://random-company.com/itmediasolutions'
    },
    {
        id: '4',
        title: 'Elektronik-Entwickler Praktikum',
        company: 'Elektronic Design',
        location: 'Linz',
        duration: '3 Monate',
        deadline: '20. Mai 2025',
        workMode: 'On-site',
        logo: '/assets/company-logos/ElektronicDesign_Logo.png',
        category: ['Elektronik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/elektronicdesign'
    },
    {
        id: '5',
        title: 'Datenwissenschafts Praktikum',
        company: 'MeliCorp',
        location: 'Salzburg',
        duration: '6 Monate',
        deadline: '25. April 2025',
        workMode: 'Hybrid',
        logo: '/assets/company-logos/MeliCorp_Logo.png',
        category: ['Informatik'],
        schoolYear: '4. Schulstufe',
        companyLink: 'https://random-company.com/melicorp'
    },
    {
        id: '6',
        title: 'Medizintechnik Praktikum',
        company: 'TechMed Innovations',
        location: 'Innsbruck',
        duration: '3 Monate',
        deadline: '10. Mai 2025',
        workMode: 'On-site',
        logo: '/assets/company-logos/TechMed_Innovations_Logo.png',
        category: ['Medientechnik', 'Informatik', 'Medizintechnik', 'Elektronik'],
        schoolYear: '4. Schulstufe',
        companyLink: 'https://random-company.com/techmed'
    },
    {
        id: '7',
        title: 'Projekt Management Praktikum',
        company: 'Nexus Solutions',
        location: 'Wien',
        duration: '4 Monate',
        deadline: '22. Mai 2025',
        workMode: 'Hybrid',
        logo: '/assets/company-logos/NexusSolutions_Logo.png',
        category: ['Informatik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/nexus'
    },
    {
        id: '8',
        title: 'Frontend-Entwicklung Praktikum',
        company: 'Elysee Industries',
        duration: '3 Monate',
        deadline: '12. Mai 2025',
        workMode: 'Remote',
        logo: '/assets/company-logos/ElyseeIndustries_Logo.png',
        category: ['Informatik'],
        schoolYear: '2. Schulstufe',
        companyLink: 'https://random-company.com/elysee'
    },
    {
        id: '9',
        title: 'Grafikdesign Praktikum',
        company: 'LuminaTech',
        location: 'Graz',
        duration: '6 Monate',
        deadline: '28. April 2025',
        workMode: 'On-site',
        logo: '/assets/company-logos/LuminaTech_Logo.png',
        category: ['Medientechnik'],
        schoolYear: '3. Schulstufe',
        companyLink: 'https://random-company.com/lumina'
    }
];

const Internships = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-16 md:pt-20">
                <section className="py-10 md:py-16 bg-muted/30">
                    <div className="container-xl">
                        <FadeIn>
                            <h1 className="heading-md text-center mb-6">Praktikumsmöglichkeiten durchsuchen</h1>
                        </FadeIn>
                        <FadeIn delay={100}>
                            <p className="text-muted-foreground text-lg text-center max-w-3xl mx-auto mb-8">
                                Finde das perfekte Praktikum, das zu deinen Fähigkeiten, Interessen und Karrierezielen passt
                            </p>
                        </FadeIn>
                    </div>
                </section>

                <section className="py-10 md:py-16">
                    <div className="container-xl">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-xl font-semibold">
                                {ALL_INTERNSHIPS.length} Praktika gefunden
                            </h2>
                        </div>

                        {ALL_INTERNSHIPS.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {ALL_INTERNSHIPS.map((internship, index) => (
                                    <FadeIn key={internship.id} delay={index * 50}>
                                        <InternshipCard internship={internship} />
                                    </FadeIn>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <FadeIn>
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground mb-4">
                                        <Search className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Keine Praktika gefunden</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                        Wir konnten keine Praktika finden, die deinen Kriterien entsprechen. Versuche, deine Filter anzupassen oder andere Suchbegriffe zu verwenden.
                                    </p>
                                </FadeIn>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Internships;
