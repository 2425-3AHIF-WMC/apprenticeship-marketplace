import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from './FadeIn';

const PartnerSection = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="container-xl">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h2 className="htl-header mb-8 text-center">Für Unternehmen</h2>
                    </FadeIn>
                    <FadeIn delay={100}>
                        <h2 className="heading-md mb-4">Praktika veröffentlichen leicht gemacht</h2>
                    </FadeIn>
                    <FadeIn delay={200}>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Um ein Praktikum hochladen zu dürfen, müssen Unternehmen zumindest <strong>Silber-Mitglied</strong> im Absolventenverein sein. Die Mitgliedschaft wird bei der erstmaligen Registrierung zum Praktikumsportal überprüft.
                        </p>
                    </FadeIn>
                </div>
                <FadeIn delay={300}>
                    <div className="bg-muted/30 rounded-2xl p-8 md:p-12 lg:text-left text-center">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="heading-sm mb-4">Mitglied werden & Praktika posten</h3>
                                <p className="text-muted-foreground mb-8">
                                    Als Mitglied erhalten Sie exklusiven Zugang zu den <strong>Top-Schüler:innen der HTL</strong>, die in der Industrie stark nachgefragt sind. Profitieren Sie von hochmotivierten Talenten mit exzellenter technischer Ausbildung.
                                </p>
                                <Button asChild>
                                    <Link to="https://www.absleo.at/allgemeines/mitgliedschaft/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                                        Jetzt Mitglied werden
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>   
                            </div>
                            <div className="relative ml-auto">
                                <div className="relative rounded-xl overflow-hidden shadow-elevated">
                                    <img
                                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                                        alt="Business collaboration"
                                        className="w-full md:h-80 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end text-left">
                                        <div className="p-6">
                                            <span className="md:text-sm text-xs text-white font-bold">Exklusiver Zugang zu</span>
                                            <div className="lg:text-3xl text-2xl font-bold text-white">gefragten Nachwuchstalenten</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

export default PartnerSection;