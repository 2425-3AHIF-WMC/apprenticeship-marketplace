
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const InfoCards = () => {
    return (
        <section className="py-12 bg-muted/20 dark:bg-muted/10">
            <div className="container-xl">
                <h2 className="htl-header mb-8 text-center">Wichtige Informationen</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dokumente Karte */}
                    <Card className="info-card">
                        <CardHeader>
                        </CardHeader>
                        <CardContent className="flex-grow">

                        </CardContent>
                        <CardFooter>

                        </CardFooter>
                    </Card>

                    {/* Schulwebsite Karte */}
                    <Card className="info-card">
                        <CardHeader>
                        </CardHeader>
                        <CardContent className="flex-grow">

                        </CardContent>
                        <CardFooter>

                        </CardFooter>
                    </Card>

                    {/* FAQs Karte */}
                    <Card className="info-card">
                        <CardHeader>
                        </CardHeader>
                        <CardContent className="flex-grow">

                        </CardContent>
                        <CardFooter>

                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default InfoCards;
