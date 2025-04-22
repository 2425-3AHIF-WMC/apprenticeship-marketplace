
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-24">
        <div className="container-sm max-w-md py-16">
          <FadeIn>
            <div className="text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <ShieldAlert className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="heading-md mb-4">Zugriff verweigert</h1>
              <p className="text-muted-foreground mb-8">
                Sie haben nicht die erforderlichen Berechtigungen, um auf diese Seite zuzugreifen.
                Bitte melden Sie sich mit einem entsprechenden Konto an.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="default">
                  <Link to="/">Zurück zur Startseite</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/login">Zur Anmeldung</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessDenied;
