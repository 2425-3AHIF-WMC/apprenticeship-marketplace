import Hero from "@/components/Hero.tsx";
import Navbar from "@/components/Navbar";
import InfoCards from "@/components/InfoCards";
import PartnerSection from "@/components/PartnerSection"

const Index = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <InfoCards />
                <PartnerSection />
            </main>
            <div style={{ minHeight: "100vh" }}>

            </div>
        </div>

        );
};

export default Index;