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
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="student"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm flex-1"
                                >
                                    Schüler
                                </TabsTrigger>
                                <TabsTrigger
                                    value="company"
                                    className=".text-gray-600 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm flex-1"
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
                                <span>Test</span>
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
