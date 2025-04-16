import Hero from "@/components/Hero.tsx";
import Navbar from "@/components/Navbar";
import InfoCards from "@/components/InfoCards";
import Footer from "@/components/Footer"
import PartnerSection from "@/components/PartnerSection"

const Index = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <main className="flex-1">
                <Hero/>
                <InfoCards/>
                <PartnerSection/>
            </main>
            <Footer/>
        </div>
    );
};

export default Index;