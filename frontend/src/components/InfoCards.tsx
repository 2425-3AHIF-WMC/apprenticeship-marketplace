
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink, School, BookOpen } from "lucide-react";

const InfoCards = () => {
    return (
        <section className="py-12 bg-muted/20 dark:bg-muted/10">
            <div className="container-xl">
                <h2 className="htl-header mb-8 text-center">Wichtige Informationen</h2>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Dokumente Karte */}
                    <Card className="info-card">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 rounded-full bg-htl-informatik/10 text-htl-informatik">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <CardTitle>Unterlagen</CardTitle>
                            </div>
                            <CardDescription>
                                Wichtige Formulare und Dokumente für dein Praktikum
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <span className="inline-block w-2 h-2 mt-1.5 mr-2 rounded-full bg-htl-informatik" />
                                    <a
                                        href="/documents/formular-pflichtpraktikum-doppelbogen.pdf"
                                        className="text-foreground hover:text-htl-informatik transition-colors"
                                        target="_blank"
                                    >
                                        Pflichtpraktikumsbestätigung
                                    </a>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-2 h-2 mt-1.5 mr-2 rounded-full bg-htl-informatik" />
                                    <a
                                        href="https://leowiki.htl-leonding.ac.at/doku.php?id=org:forms"
                                        className="text-foreground hover:text-htl-informatik transition-colors"
                                        target="_blank"
                                    >
                                        Praktikumsnachweis
                                    </a>
                                </li>
                                <li className="flex items-start">
                                    <span className="inline-block w-2 h-2 mt-1.5 mr-2 rounded-full bg-htl-informatik" />
                                    <a
                                        href="/documents/formular-schulbesuchsbestaetigung.pdf"
                                        className="text-foreground hover:text-htl-informatik transition-colors"
                                        target="_blank"
                                    >
                                        Schulbesuchsbestätigung
                                    </a>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Schulwebsite Karte */}
                    <Card className="info-card">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 rounded-full bg-htl-informatik/10 text-htl-informatik">
                                    <School className="h-5 w-5" />
                                </div>
                                <CardTitle>HTL Leonding</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow ">
                            <div className=" rounded-md overflow-hidden mb-4 flex justify-center h-auto">
                                <img
                                    src="/assets/htllogo_small.png"
                                    alt="HTL Leonding Website"
                                    className="w-auto h-20 object-co    ver"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Besuche die offizielle Website der HTL Leonding für mehr Informationen über die Schule, Ausbildungsschwerpunkte und aktuelle Neuigkeiten.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" asChild>
                                <a href="https://www.htl-leonding.at/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                    Website besuchen
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* FAQs Karte */}
                    <Card className="info-card">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 rounded-full bg-htl-informatik/10 text-htl-informatik">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <CardTitle>Praktikums-FAQs</CardTitle>
                            </div>
                            <CardDescription>
                                Häufig gestellte Fragen und Antworten zum Pflichtpraktikum
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Wie lange muss mein Praktikum dauern?</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Es müssen insgesamt 8 Wochen Pflichtpraktikum erbracht werden.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Was passiert, wenn ich kein Praktikum finde?</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Sprich frühzeitig mit deinem KV oder AV darüber.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Was ist wenn ich weniger als 8 Wochen Praktikum habe?</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Wenn du zur Matura nicht alle 8 Wochen hast, darfst du nicht Maturieren.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default InfoCards;
