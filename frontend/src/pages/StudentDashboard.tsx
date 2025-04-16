import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const StudentDashboard = () => {
    const { studentUsername, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-24 pb-16">
                <div className="container-xl max-w-4xl">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="heading-md">Willkommen, {studentUsername}!</h1>
                        <Button 
                            variant="outline" 
                            onClick={handleLogout}
                            className="flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            Abmelden
                        </Button>
                    </div>
                    <p className="text-muted-foreground">
                        Dies ist Ihr persönlicher Dashboard-Bereich.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default StudentDashboard; 