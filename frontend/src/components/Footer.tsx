import {Link} from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t py-10 text-sm text-muted-foreground">
            <div className="container mx-auto px-4 text-center md:text-left md:flex md:justify-around">
                <div className="mb-6 md:mb-0 item-center flex flex-col justify-center">
                    <h2 className="text-xl text-primary mb-2">
                        HTL Leonding Praktikumsportal
                    </h2>
                    <div className="flex justify-center md:justify-start">
                        <p className="max-w-xs text-muted-foreground text-center md:text-left">
                            Verbindung von Schüler:innen mit wertvollen Praktikumsmöglichkeiten zur Förderung ihrer
                            Ausbildung und ihres Karrierewegs.
                        </p>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg mb-2">Schnellzugriff</h3>
                    <ul className="space-y-1">
                        <li>
                            <Link to="/" className="hover:text-primary transition-colors">
                                Startseite
                            </Link>
                        </li>
                        <li>
                            <Link to="/internships" className="hover:text-primary transition-colors">
                                Praktika durchsuchen
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" className="hover:text-primary transition-colors">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 text-center border-t pt-4">
                <p>&copy; {new Date().getFullYear()} HTL Leonding Praktikumsportal. Alle Rechte vorbehalten.</p>
            </div>
        </footer>
    );
};

export default Footer;
