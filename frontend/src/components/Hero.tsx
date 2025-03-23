import {Button} from '@/components/ui/button';
import {Search, ArrowRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import FadeIn from './FadeIn';

const Hero = () => {
    const tags = [
        {name: 'Informatik', color: 'hover:text-htl-informatik'},
        {name: 'Medientechnik', color: 'hover:text-htl-medientechnik'},
        {name: 'Elektronik', color: 'hover:text-htl-elektronik'},
        {name: 'Medizintechnik', color: 'hover:text-htl-medizintechnik'},
    ];

    return (
        <div className="relative mt-16 md:mt-20">
            {/* Hero Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/img-of-htl-leonding.png"
                    alt="HTL Leonding"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"/>
            </div>

            <section className="relative z-10 pt-28 pb-20 md:pb-28 lg:pt-36 lg:pb-32 overflow-hidden">
                <div className="container-xl">
                    <div className="max-w-3xl mx-auto text-center">

                        <FadeIn delay={200}>
                            <h1 className="heading-lg text-balance mb-6 text-white">
                                Finde dein perfektes Praktikum
                            </h1>
                        </FadeIn>

                        <FadeIn delay={300}>
                            <p className="text-lg md:text-xl text-white/80 mb-8 md:mb-10 text-balance">
                                Entdecke Praktikumsplätze, die zu deinen Interessen und Ausbildungsschwerpunkten passen.
                            </p>
                        </FadeIn>

                        <div
                            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="relative w-full sm:w-auto">
                                {/* Input and icon in same relative container */}
                                <FadeIn delay={400}>
                                    <div
                                        className="w-full sm:w-80 md:w-96 rounded-lg border border-white/20 bg-black/30 px-3 py-2.5">
                                        <div className="relative">
                                            <div
                                                className="absolute inset-y-0 left-0 pl-0.5 pb-0.5 flex items-center pointer-events-none">
                                                <Search className="h-5 w-5 text-gray-400"/>
                                            </div>

                                            <input
                                                type="text"
                                                placeholder="Praktikum suchen..."
                                                className="w-full pl-8 pr-2 bg-transparent text-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>

                            {/* Button stays outside animation */}
                            <FadeIn delay={400}>
                                <Button asChild variant="default">
                                    <Link to="/internships">
                                        Alle Praktika durchsuchen
                                        <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Link>
                                </Button>
                            </FadeIn>
                        </div>


                        <FadeIn delay={500}>
                            <div
                                className="flex flex-wrap items-center justify-center gap-1 text-sm text-white/70 mt-6">
                                {tags.map((tag) => (
                                    <span
                                        key={tag.name}
                                        className={`
                                          px-2 py-1 
                                          ${tag.color} 
                                          transition-colors
                                          cursor-pointer
                                          
                                        `}>
                                        {tag.name}
                                      </span>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;
