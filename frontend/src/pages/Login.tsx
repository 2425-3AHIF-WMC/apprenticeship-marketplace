import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {LockKeyhole, User} from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PasswordResetInfo from "@/components/PasswordResetInfo";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [studentUsername, setStudentUsername] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [showResetInfo, setShowResetInfo] = useState(false);



    const handleStudentLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            localStorage.setItem('studentLoggedIn', 'true');
            localStorage.setItem('studentName', studentUsername);

            navigate('/schueler/dashboard');
            setIsLoading(false);
        }, 1000);
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
                                <form onSubmit={handleStudentLogin}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="student-username">Benutzername</Label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-muted-foreground">
                                                    <User className="h-4 w-4"/>
                                                </div>
                                                <Input
                                                    id="student-username"
                                                    type="text"
                                                    placeholder="if000000"
                                                    className="pl-10"
                                                    value={studentUsername}
                                                    onChange={(e) => setStudentUsername(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="student-password">Passwort</Label>
                                                <Link to="#"
                                                      onClick={(e) => {
                                                          e.preventDefault();
                                                          setShowResetInfo(true);
                                                      }}
                                                      className="text-sm text-primary hover:underline">
                                                    Passwort vergessen?
                                                </Link>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute left-3 top-3 text-muted-foreground">
                                                    <LockKeyhole className="h-4 w-4"/>
                                                </div>
                                                <Input
                                                    id="student-password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10"
                                                    value={studentPassword}
                                                    onChange={(e) => setStudentPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                                        {isLoading ? "Anmeldung läuft..." : "Anmelden"}
                                    </Button>
                                </form>
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
            <PasswordResetInfo open={showResetInfo} onClose={() => setShowResetInfo(false)} />
        </div>

);
};

export default Login;
