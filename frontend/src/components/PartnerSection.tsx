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
                </div>
                <FadeIn delay={200}>
                    <div className="bg-muted rounded-2xl p-8 md:p-12 lg:text-left text-center">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="heading-sm mb-4">Registrieren & Praktika posten</h3>
                                <p className="text-muted-foreground mb-8">
                                    Als Mitglied erhalten Sie exklusiven Zugang zu den <strong>Top-Schüler:innen der
                                        HTL</strong>, die in der Industrie stark nachgefragt sind. Profitieren Sie von
                                    hochmotivierten Talenten mit exzellenter technischer Ausbildung.
                                </p>
                                <Button asChild>
                                    <Link to="/login" className="flex items-center">
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
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end text-left">
                                        <div className="p-6">
                                            <span className="md:text-sm text-xs text-white font-bold">Exklusiver Zugang zu</span>
                                            <div className="lg:text-3xl text-2xl font-bold text-white">gefragten
                                                Nachwuchstalenten
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
                <div className="container-xl py-16 md:py-24">
                    <div className="text-center mb-16">
                        <FadeIn>
                            <span className="text-sm font-medium text-primary mb-2 block">Einfacher Prozess</span>
                        </FadeIn>

                            <FadeIn delay={100}>
                                <h2 className="htl-header text-center">So funktioniert's</h2>
                            </FadeIn>
                            <FadeIn delay={200}>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    In wenigen Schritten können Sie als Unternehmen Praktika veröffentlichen und Nachwuchstalente erreichen.
                                </p>
                            </FadeIn>
                        </div>

                        <div className="grid xl:grid-cols-5 gap-8 relative items-stretch px-4 md:px-0">
                            <div className="hidden xl:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10" />
                            <div className="block xl:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -z-10" style={{transform: 'translateX(-50%)'}} />
                            {[
                                {
                                    step: "01",
                                    title: "Registrieren",
                                    description: "Erstellen Sie ein Unternehmenskonto mit Ihren Firmendaten."
                                },
                                {
                                    step: "02",
                                    title: "E-Mail verifizieren",
                                    description: "Bestätigen Sie Ihre E-Mail-Adresse über den zugesandten Link."
                                },
                                {
                                    step: "03",
                                    title: "Praktikum hochladen",
                                    description: "Laden Sie Ihr erstes Praktikumsangebot im Portal hoch."
                                },
                                {
                                    step: "04",
                                    title: "Admin prüft Unternehmen",
                                    description: "Ein Administrator prüft und verifiziert Ihr Unternehmen."
                                },
                                {
                                    step: "05",
                                    title: "Praktika werden online gestellt",
                                    description: "Nach der Verifizierung sind Ihre Praktika sofort für Schüler:innen sichtbar."
                                }
                            ].map((item, i) => (
                                <FadeIn key={item.step} delay={i * 200 + 300}>
                                    <div className="relative h-full flex flex-col">
                                        <div className="p-6 rounded-xl bg-card shadow-subtle border border-border/40 relative z-10 h-full flex flex-col">
                                            <div className="absolute -top-5 left-6 inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold">
                                                {item.step}
                                            </div>
                                            <h3 className="text-xl font-semibold mt-6 mb-3">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Button asChild size="lg">
                                <Link to="/login" className="flex items-center">
                                    Jetzt starten
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            </div>
                        </div>
                    </div>
                </section>
    );
};

export default PartnerSection;