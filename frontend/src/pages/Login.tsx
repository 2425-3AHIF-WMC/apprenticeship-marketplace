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
    const [isRegistration, setIsRegistration] = useState(false);
    const navigate = useNavigate();
    const { login, studentIsAuthenticated, studentUsername } = useAuth();
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');


    useEffect(() => {
        if (studentIsAuthenticated) {
            if (studentUsername === 'if220183') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        }
    }, [studentIsAuthenticated, studentUsername, navigate]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await login();
        } catch (error) {
            console.error('Login failed:', error);
            setIsLoading(false);
        }
    };

    const handleCompanyLogin = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/company/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailLogin,
                    password: passwordLogin
                }),
            });
            if (!res.ok) {
                throw new Error("Login fehlgeschlagen");
            }
            const data = await res.json();

            localStorage.setItem("companyAccessToken", data.accessToken);
            localStorage.setItem("companyRefreshToken", data.refreshToken);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistration = () => {
        setIsRegistration(prev => !prev);
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
                                    className="flex-1 px-3 py-2.5 text-lg font-medium text-muted-foreground transition-colors duration-200 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
                                >
                                    Schüler
                                </TabsTrigger>
                                <TabsTrigger
                                    value="company"
                                    className="flex-1 px-3 py-2.5 text-lg font-medium text-muted-foreground transition-colors duration-200 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
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
                                { !isRegistration ?
                                <Card className="text-left">
                                    <CardHeader>
                                        <CardTitle>Unternehmensanmeldung</CardTitle>
                                        <CardDescription>
                                            Melden Sie sich mit Ihrem Unternehmensaccount an
                                        </CardDescription>
                                    </CardHeader>
                                        <CardContent>
                                        <label className="text-sm font-medium">E-Mail</label>
                                        <Input type={"email"} value={emailLogin} onChange={e => setEmailLogin(e.target.value)} className="mb-4" placeholder="E-Mail eingeben"/>
                                        <label className="text-sm font-medium">Passwort</label>
                                        <Input type="password" value={passwordLogin} onChange={e => setPasswordLogin(e.target.value)} className="mb-4" placeholder="Passwort eingeben" />
                                        <Button
                                            className="w-full text-md"
                                            disabled={isLoading}
                                            onClick={handleCompanyLogin}
                                        >
                                            {isLoading ? "Anmeldung läuft..." : "Anmelden"}
                                        </Button>

                                    </CardContent>
                                    <CardFooter className="flex justify-center border-t pt-6">
                                        <p className="text-sm text-muted-foreground">
                                            Sie haben noch kein Konto? Registrieren Sie sich <span
                                            onClick={handleRegistration} className="text-primary cursor-pointer hover:underline">hier</span>
                                        </p>
                                    </CardFooter>

                                </Card>
                                :
                                    <Card className="text-left">
                                        <CardHeader>
                                            <CardTitle>Unternehmensregistrierung</CardTitle>
                                            <CardDescription>
                                                Registrieren Sie sich mit Ihrem Unternehmensaccount
                                            </CardDescription>
                                        </CardHeader>
                                            <CardContent>
                                                <label className="text-sm font-medium">Firmenname</label>
                                                <Input type="text" className="mb-4" placeholder="Firmenname eingeben"/>
                                                <label className="text-sm font-medium">Firmenbuchnummer</label>
                                                <Input type="text" className="mb-4" placeholder="Firmenbuchnummer eingeben"/>
                                                <label className="text-sm font-medium">E-Mail</label>
                                                <Input type="email" className="mb-4" placeholder="E-Mail eingeben"/>
                                                <label className="text-sm font-medium">Telefonnummer</label>
                                                <Input type="tel" className="mb-4" placeholder="Telefonnummer eingeben"/>
                                                <label className="text-sm font-medium">Webseite</label>
                                                <Input type="url" className="mb-4" placeholder="Webseite eingeben"/>
                                                <label className="text-sm font-medium">Passwort</label>
                                                <Input type="password" className="mb-4" placeholder="Passwort eingeben" />
                                                <Button
                                                    className="w-full text-md"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "Registrierung läuft..." : "Registrieren"}
                                                </Button>

                                            </CardContent>
                                        <CardFooter className="flex justify-center border-t pt-6">
                                            <p className="text-sm text-muted-foreground">
                                                Sie haben bereits ein Konto? Melden Sie sich <span
                                                onClick={handleRegistration} className="text-primary cursor-pointer hover:underline">hier</span>
                                                <span> an</span>
                                            </p>
                                        </CardFooter>
                                    </Card>
                                }
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
