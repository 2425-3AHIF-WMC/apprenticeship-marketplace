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
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Redirect to dashboard if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/schueler/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await login();
            // The redirect will happen automatically through the useEffect
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
                    </FadeIn>
                </div>
            </main>

            <Footer/>
        </div>
    );
};

export default Login;
