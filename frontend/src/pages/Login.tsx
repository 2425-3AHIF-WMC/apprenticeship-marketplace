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
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {MailWarning, ShieldAlert} from "lucide-react";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);
    const navigate = useNavigate();
    const { login, studentIsAuthenticated, studentUsername } = useAuth();
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEmailExistsDialogOpen, setEmailExistsDialogOpen] = useState(false);
    const [nameRegistration, setNameRegistration] = useState('');
    const [companyNumberRegistration, setCompanyNumberRegistration] = useState('');
    const [emailRegistration, setEmailRegistration] = useState('');
    const [phoneNumberRegistration, setPhoneNumberRegistration] = useState('');
    const [websiteRegistration, setWebsiteRegistration] = useState('');
    const [passwordRegistration, setPasswordRegistration] = useState('');
    const [errors, setErrors] = useState<{
        name?: string;
        companyNumber?: string;
        email?: string;
        phone?: string;
        website?: string;
        password?: string;
    }>({});

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
                credentials: "include",
                body: JSON.stringify({
                    email: emailLogin,
                    password: passwordLogin
                }),
            });
            if (!res.ok) {
                setIsDialogOpen(true);
                return;
            }
            const data = await res.json();

            localStorage.setItem("companyAccessToken", data.accessToken);
            navigate('/company/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompanyRegistration = async () => {
        if(!validateCompanyRegistrationFields()) {
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/company/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    name: nameRegistration,
                    companyNumber: companyNumberRegistration,
                    email: emailRegistration,
                    phoneNumber: phoneNumberRegistration,
                    website: websiteRegistration,
                    password: passwordRegistration
                })
            });
            if(!res.ok) {
                setEmailExistsDialogOpen(true);
                return;
            }

            const data = await res.json();

            localStorage.setItem("companyAccessToken", data.accessToken);
            navigate('/company/dashboard');
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const validateCompanyRegistrationFields = () => {
        const newErrors: typeof errors = {};

        if (!nameRegistration.trim()) {
            newErrors.name = "Firmenname ist erforderlich.";
        }

        if (!companyNumberRegistration.trim()) {
            newErrors.companyNumber = "Firmenbuchnummer ist erforderlich.";
        }

        if (!emailRegistration || !/^\w+@\w+\.\w+$/.test(emailRegistration)) {
            newErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
        }

        if (!phoneNumberRegistration || !/^\+?[0-9\-()\s]+$/.test(phoneNumberRegistration)) {
            newErrors.phone = "Bitte geben Sie eine gültige Telefonnummer ein.";
        }

        if (!websiteRegistration ||   !/^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+$/i.test(websiteRegistration.trim())) {
            newErrors.website = "Bitte geben Sie eine gültige URL ein.";
        }

        if (!passwordRegistration || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?]).{8,}$/.test(passwordRegistration)) {
            newErrors.password = "Das Passwort muss mindestens 8 Zeichen lang sein, " +
                "mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl sowie ein Sonderzeichen enthalten.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    const toggleCompanyRegisterForm = () => {
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
                                            onClick={toggleCompanyRegisterForm} className="text-primary cursor-pointer hover:underline">hier</span>
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
                                                <Input type="text" value={nameRegistration} className={`mb-1 ${errors.name ? 'border-red-500' : ''}`}
                                                       onChange={e => setNameRegistration(e.target.value)} placeholder="Firmenname eingeben"/>
                                                {errors.name && (
                                                    <p className="text-sm text-red-500 mb-3">{errors.name}</p>
                                                )}
                                                <label className="text-sm font-medium">Firmenbuchnummer</label>
                                                <Input type="text" value={companyNumberRegistration} className={`mb-1 ${errors.companyNumber ? 'border-red-500' : ''}`}
                                                       onChange={e => setCompanyNumberRegistration(e.target.value)} placeholder="Firmenbuchnummer eingeben"/>
                                                {errors.companyNumber && (
                                                    <p className="text-sm text-red-500 mb-3">{errors.companyNumber}</p>
                                                )}
                                                <label className="text-sm font-medium">E-Mail</label>
                                                <Input type="email" value={emailRegistration} className={`mb-1 ${errors.email ? 'border-red-500' : ''}`}
                                                       onChange={e => setEmailRegistration(e.target.value)} placeholder="E-Mail eingeben"/>
                                                {errors.email && (
                                                    <p className="text-sm text-red-500 mb-3">{errors.email}</p>
                                                )}
                                                <label className="text-sm font-medium">Telefonnummer</label>
                                                <Input type="tel" value={phoneNumberRegistration} className={`mb-1 ${errors.phone ? 'border-red-500' : ''}`}
                                                       onChange={e => setPhoneNumberRegistration(e.target.value)} placeholder="Telefonnummer eingeben"/>
                                                {errors.phone && (
                                                    <p className="text-sm text-red-500 mb-3">{errors.phone}</p>
                                                )}
                                                <label className="text-sm font-medium">Webseite</label>
                                                <Input type="url" value={websiteRegistration} className={`mb-1 ${errors.website ? 'border-red-500' : ''}`}
                                                       onChange={e => setWebsiteRegistration(e.target.value)} placeholder="Webseite eingeben"/>
                                                {errors.website && (
                                                    <p className="text-sm text-red-500 mb-3">{errors.website}</p>
                                                )}
                                                <label className="text-sm font-medium">Passwort</label>
                                                <Input type="password" value={passwordRegistration} className={`mb-1 ${errors.password ? 'border-red-500' : ''}`}
                                                       onChange={e => setPasswordRegistration(e.target.value)} placeholder="Passwort eingeben" />
                                                {errors.password && (
                                                    <p className="text-sm text-red-500 mb-3">{errors.password}</p>
                                                )}
                                                <Button
                                                    className="w-full text-md"
                                                    disabled={isLoading}
                                                    onClick={handleCompanyRegistration}
                                                >
                                                    {isLoading ? "Registrierung läuft..." : "Registrieren"}
                                                </Button>

                                            </CardContent>
                                        <CardFooter className="flex justify-center border-t pt-6">
                                            <p className="text-sm text-muted-foreground">
                                                Sie haben bereits ein Konto? Melden Sie sich <span
                                                onClick={toggleCompanyRegisterForm} className="text-primary cursor-pointer hover:underline">hier</span>
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
            <Dialog open={isDialogOpen} onOpenChange={open => setIsDialogOpen(open)}>
                <DialogContent className="text-center">
                    <div className="flex flex-col items-center gap-4">
                        <ShieldAlert className="text-red-600 h-10 w-10" />
                        <DialogHeader>
                            <DialogTitle>Login fehlgeschlagen</DialogTitle>
                            <DialogDescription>
                                Bitte überprüfen Sie Ihre E-Mail-Adresse und Ihr Passwort.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setIsDialogOpen(false)} className="mt-4 w-full max-w-xs">
                            Verstanden
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isEmailExistsDialogOpen} onOpenChange={open => setEmailExistsDialogOpen(open)}>
                <DialogContent className="text-center">
                    <div className="flex flex-col items-center gap-4">
                        <MailWarning className="text-yellow-300 h-10 w-10" />
                        <DialogHeader>
                            <DialogTitle>Registrierung fehlgeschlagen</DialogTitle>
                            <DialogDescription>
                                E-Mail ist bereits in Verwendung.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setEmailExistsDialogOpen(false)} className="mt-4 w-full max-w-xs">
                            Verstanden
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Login;
