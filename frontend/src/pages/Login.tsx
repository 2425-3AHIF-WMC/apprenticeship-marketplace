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
import {Mail, MailWarning, ShieldAlert} from "lucide-react";
import { isAdmin } from '@/lib/authUtils';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistration, setIsRegistration] = useState(false);
    const navigate = useNavigate();
    const { login, studentIsAuthenticated, studentId } = useAuth();
    const [emailLogin, setEmailLogin] = useState('');
    const [passwordLogin, setPasswordLogin] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEmailExistsDialogOpen, setEmailExistsDialogOpen] = useState(false);
    const [isVerificationEmailSentDialogOpen, setVerificationEmailSentDialogOpen] = useState(false);
    const [isVerificationNeededDialogOpen, setVerificationNeededDialogOpen] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);
    const [isForgotPasswordSuccessDialogOpen, setIsForgotPasswordSuccessDialogOpen] = useState(false);

    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail || !/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
            alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/company/send-password-reset-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: forgotPasswordEmail })
            });

            if (res.ok) {
                setIsForgotPasswordDialogOpen(false);
                setIsForgotPasswordSuccessDialogOpen(true);
            } else {
                alert("Fehler beim Senden der Zurücksetzungs-E-Mail.");
            }
        } catch (err) {
            console.error(err);
            alert("Serverfehler beim Zurücksetzen des Passworts.");
        }
    };

    useEffect(() => {
        if (studentIsAuthenticated && studentId) {
            isAdmin(studentId).then((admin) => {
                if (admin) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            });
        }
    }, [studentIsAuthenticated, studentId, navigate]);

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
            console.log(res.status)
            if(res.status === 403) {
                setVerificationNeededDialogOpen(true)
                return;
            }
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

    const companyRegistrationSchema = z.object({
        name: z.string().min(1, "Firmenname ist erforderlich.").max(100, "Firmenname ist zu lang."),
        companyNumber: z.string().min(1, "Firmenbuchnummer ist erforderlich.").max(50, "Firmenbuchnummer ist zu lang."),
        email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
        phone: z.string().regex(/^\+?[0-9\-()\s]+$/, "Bitte geben Sie eine gültige Telefonnummer ein."),
        website: z.string().regex(/^(https?:\/\/)?(www\.)?[\w-]+(\.[\w-]+)+$/i, "Bitte geben Sie eine gültige Webseite ein."),
        password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:'",.<>/?]).{8,}$/, "Das Passwort muss mindestens 8 Zeichen lang sein, mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl sowie ein Sonderzeichen enthalten."),
    });

    const companyRegistrationForm = useForm<z.infer<typeof companyRegistrationSchema>>({
        resolver: zodResolver(companyRegistrationSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            companyNumber: "",
            email: "",
            phone: "",
            website: "",
            password: "",
        },
    });

    const handleCompanyRegistration = async (data?: z.infer<typeof companyRegistrationSchema>) => {
        const values = data || companyRegistrationForm.getValues();
        const isValid = await companyRegistrationForm.trigger();
        if (!isValid) return;
        setIsLoading(true);
        try {
            const { phone, ...rest } = values;
            const payload = { ...rest, phoneNumber: phone };
            const res = await fetch('http://localhost:5000/api/company/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(payload)
            });
            if (res.status === 201) {
                setVerificationEmailSentDialogOpen(true);
            } else if (!res.ok) {
                setEmailExistsDialogOpen(true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
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
                                    <CardFooter className="flex justify-center border-t pt-6 flex-col items-center gap-0.5">
                                        <p className="text-sm text-muted-foreground">
                                            Sie haben noch kein Konto? Registrieren Sie sich <span
                                            onClick={toggleCompanyRegisterForm} className="text-primary cursor-pointer hover:underline">hier</span>
                                        </p>
                                        <button className="text-sm text-primary hover:underline"
                                            onClick={() => setIsForgotPasswordDialogOpen(true)}>
                                            Passwort vergessen?
                                        </button>
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
                                                <form onSubmit={companyRegistrationForm.handleSubmit(handleCompanyRegistration)}>
                                                    <label className="text-sm font-medium">Firmenname</label>
                                                    <Input type="text" {...companyRegistrationForm.register("name")}
                                                        className={`mb-1 ${companyRegistrationForm.formState.errors.name ? 'border-red-500' : ''}`}
                                                        placeholder="Firmenname eingeben" />
                                                    {companyRegistrationForm.formState.errors.name && (
                                                        <p className="text-sm text-red-500 mb-3">{companyRegistrationForm.formState.errors.name.message}</p>
                                                    )}
                                                    <label className="text-sm font-medium">Firmenbuchnummer</label>
                                                    <Input type="text" {...companyRegistrationForm.register("companyNumber")}
                                                        className={`mb-1 ${companyRegistrationForm.formState.errors.companyNumber ? 'border-red-500' : ''}`}
                                                        placeholder="Firmenbuchnummer eingeben" />
                                                    {companyRegistrationForm.formState.errors.companyNumber && (
                                                        <p className="text-sm text-red-500 mb-3">{companyRegistrationForm.formState.errors.companyNumber.message}</p>
                                                    )}
                                                    <label className="text-sm font-medium">E-Mail</label>
                                                    <Input type="email" {...companyRegistrationForm.register("email")}
                                                        className={`mb-1 ${companyRegistrationForm.formState.errors.email ? 'border-red-500' : ''}`}
                                                        placeholder="E-Mail eingeben" />
                                                    {companyRegistrationForm.formState.errors.email && (
                                                        <p className="text-sm text-red-500 mb-3">{companyRegistrationForm.formState.errors.email.message}</p>
                                                    )}
                                                    <label className="text-sm font-medium">Telefonnummer</label>
                                                    <Input type="tel" {...companyRegistrationForm.register("phone")}
                                                        className={`mb-1 ${companyRegistrationForm.formState.errors.phone ? 'border-red-500' : ''}`}
                                                        placeholder="Telefonnummer eingeben" />
                                                    {companyRegistrationForm.formState.errors.phone && (
                                                        <p className="text-sm text-red-500 mb-3">{companyRegistrationForm.formState.errors.phone.message}</p>
                                                    )}
                                                    <label className="text-sm font-medium">Webseite</label>
                                                    <Input type="text" {...companyRegistrationForm.register("website")}
                                                        className={`mb-1 ${companyRegistrationForm.formState.errors.website ? 'border-red-500' : ''}`}
                                                        placeholder="Webseite eingeben" />
                                                    {companyRegistrationForm.formState.errors.website && (
                                                        <p className="text-sm text-red-500 mb-3">{companyRegistrationForm.formState.errors.website.message}</p>
                                                    )}
                                                    <label className="text-sm font-medium">Passwort</label>
                                                    <Input type="password" {...companyRegistrationForm.register("password")}
                                                        className={`mb-1 ${companyRegistrationForm.formState.errors.password ? 'border-red-500' : ''}`}
                                                        placeholder="Passwort eingeben" />
                                                    {companyRegistrationForm.formState.errors.password && (
                                                        <p className="text-sm text-red-500 mb-3">{companyRegistrationForm.formState.errors.password.message}</p>
                                                    )}
                                                    <Button
                                                        className="w-full text-md"
                                                        disabled={isLoading}
                                                        type="submit"
                                                    >
                                                        {isLoading ? "Registrierung läuft..." : "Registrieren"}
                                                    </Button>
                                                </form>
                                            </CardContent>
                                        <CardFooter className="flex justify-center border-t pt-6 flex-col items-center gap-0.5">
                                            <p className="text-sm text-muted-foreground">
                                                Sie haben bereits ein Konto? Melden Sie sich <span
                                                onClick={toggleCompanyRegisterForm} className="text-primary cursor-pointer hover:underline">hier</span>
                                                <span> an</span>
                                            </p>
                                            <button className="text-sm text-primary hover:underline"
                                                    onClick={() => setIsForgotPasswordDialogOpen(true)}>
                                                Passwort vergessen?
                                            </button>
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
            <Dialog open={isVerificationEmailSentDialogOpen} onOpenChange={open => setVerificationEmailSentDialogOpen(open)}>
                <DialogContent className="text-center">
                    <div className="flex flex-col items-center gap-4">
                        <Mail className="text-yellow-300 h-10 w-10" />
                        <DialogHeader>
                            <DialogTitle>Bestätigungsmail</DialogTitle>
                            <DialogDescription>
                                Eine Bestätigungsmail wurde an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie Ihre E-Mail-Adresse und klicken Sie auf den Link, um Ihr Konto zu aktivieren.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setVerificationEmailSentDialogOpen(false)} className="mt-4 w-full max-w-xs">
                            Verstanden
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={isVerificationNeededDialogOpen} onOpenChange={open => setVerificationNeededDialogOpen(open)}>
                <DialogContent className="text-center">
                    <div className="flex flex-col items-center gap-4">
                        <MailWarning className="text-yellow-300 h-10 w-10" />
                        <DialogHeader>
                            <DialogTitle>Bestätigungsmail</DialogTitle>
                            <DialogDescription>
                                Eine E-Mail wurde bereits an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie Ihre E-Mail-Adresse und klicken Sie auf den Link, um Ihr Konto zu aktivieren.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setVerificationNeededDialogOpen(false)} className="mt-4 w-full max-w-xs">
                            Verstanden
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isForgotPasswordDialogOpen} onOpenChange={setIsForgotPasswordDialogOpen}>
                <DialogContent className="text-center">
                    <DialogHeader>
                        <DialogTitle>Passwort zurücksetzen</DialogTitle>
                        <DialogDescription>
                            Geben Sie Ihre E-Mail-Adresse ein, um den Link zum Zurücksetzen des Passworts zu erhalten.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        type="email"
                        placeholder="E-Mail-Adresse eingeben"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    />
                    <Button onClick={handleForgotPassword} className="mt-4 w-full">
                        Zurücksetzungslink senden
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog open={isForgotPasswordSuccessDialogOpen} onOpenChange={setIsForgotPasswordSuccessDialogOpen}>
                <DialogContent className="text-center">
                    <div className="flex flex-col items-center gap-4">
                        <Mail className="text-green-600 h-10 w-10" />
                        <DialogHeader>
                            <DialogTitle>Zurücksetzungslink gesendet</DialogTitle>
                            <DialogDescription>
                                Bitte überprüfen Sie Ihre E-Mails, um das Passwort zurückzusetzen.
                            </DialogDescription>
                        </DialogHeader>
                        <Button onClick={() => setIsForgotPasswordSuccessDialogOpen(false)} className="mt-4 w-full max-w-xs">
                            Verstanden
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Login;
