import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import FadeIn from '@/components/FadeIn';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {useAuth} from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import {Input} from "@/components/ui/input.tsx";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {login, studentIsAuthenticated} = useAuth();

    useEffect(() => {
        if (studentIsAuthenticated) {
            navigate('/student/dashboard');
        }
    }, [studentIsAuthenticated, navigate]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await login();
        } catch (error) {
            console.error('Login failed:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>

            <main className="flex-1 pt-24 pb-16">
                <div className="container-xl max-w-4xl">
                    <FadeIn>
                        <div className="text-center mb-8">
                            <h1 className="heading-md mb-4">Anmeldung</h1>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Melden Sie sich an, um auf das Praktikumsportal zuzugreifen
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={100}>
                        <Tabs defaultValue="student" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 border-b">
                                <TabsTrigger
                                    value="student"
                                    className="flex-1 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
                                >
                                    Schüler
                                </TabsTrigger>
                                <TabsTrigger
                                    value="company"
                                    className="flex-1 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
                                >
                                    Unternehmen
                                </TabsTrigger>

                            </TabsList>
                            <TabsContent value="student">
                                <Card className="text-left">
                                    <CardHeader>
                                        <CardTitle>Schüleranmeldung</CardTitle>
                                        <CardDescription>
                                            Melden Sie sich mit Ihrem Schulaccount an
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            onClick={handleLogin}
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Anmeldung läuft..." : "Mit Schulaccount anmelden"}
                                        </Button>
                                    </CardContent>
                                    <CardFooter className="flex justify-center border-t pt-6">
                                        <p className="text-sm text-muted-foreground">
                                            Bei Fragen zum Login wenden Sie sich an Ihre Lehrkräfte.
                                        </p>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="company">
                                <Card className="text-left">
                                    <CardHeader>
                                        <CardTitle>Unternehmensanmeldung</CardTitle>
                                        <CardDescription>
                                            Melden Sie sich mit Ihrem Unternehmensaccount an
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <label className="text-sm font-medium">E-Mail</label>
                                        <Input type={"email"} className="mb-4" placeholder="E-Mail eingeben"/>
                                        <label className="text-sm font-medium">Passwort</label>
                                        <Input type="password" className="mb-4" placeholder="Passwort eingeben" />
                                        <Button
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Anmeldung läuft..." : "Mit Unternehmensaccount anmelden"}
                                        </Button>
                                    </CardContent>
                                    <CardFooter className="flex justify-center border-t pt-6">
                                        <p className="text-sm text-muted-foreground">
                                            Registrieren als Unternehmen
                                        </p>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>


                    </FadeIn>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default Login;
