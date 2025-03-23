import Hero from "@/components/Hero.tsx";
import Navbar from "@/components/Navbar";

const Index = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Hero />
            </main>
            <div style={{ minHeight: "100vh" }}>

            </div>
        </div>

        );
};

export default Index;