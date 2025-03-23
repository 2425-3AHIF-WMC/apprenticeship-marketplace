import {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useIsMobile} from "@/hooks/use-mobile";
import {Menu, X, User} from "lucide-react";


const Navbar = () => {
    const [, setIsScrolled] = useState(false);
    const {pathname} = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const getNavLinks = () => {
        const baseLinks = [{href: "/", label: "Home"}];
        baseLinks.push({href: "/internships", label: "Praktika"});

        return baseLinks;
    };

    const navLinks = getNavLinks();

    const logoSrc = "/assets/htllogo-big-black.png";

    return (
        <header
            className=
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/40 backdrop-blur-md shadow-sm"
        >
            <div className="container-xl">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link
                        to="/"
                        className="text-xl font-semibold flex items-center gap-2"
                    >
                        <img
                            src={logoSrc}
                            alt="HTL Leonding Logo"
                            className="h-10 w-auto md:h-12"
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Button
                                key={link.href}
                                variant="ghost"
                                asChild
                                className={cn(
                                    "hover:bg-primary hover:text-primary-foreground text-base md:text-lg font-bold",
                                    pathname === link.href ? "text-primary font-bold" : ""
                                )}
                            >
                                <Link
                                    to={link.href}
                                >
                                    {link.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">

                        <Button asChild variant="default">
                            <Link to="/login" className="text-base font-bold">
                                <User className="h-8 w-8 md:mr-2"/>
                                {!isMobile && "Anmelden"}
                            </Link>
                        </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5"/>
                        ) : (
                            <Menu className="h-5 w-5"/>
                        )}
                    </Button>
                    </div>
                </div>
            </div>
            {isMobile && (
                <div
                    className={cn(
                        "fixed inset-x-0 top-16 transition-all duration-300 ease-in-out transform bg-background border-b border-border",
                        {
                            "translate-y-0 opacity-100 pointer-events-auto": mobileMenuOpen,
                            "-translate-y-10 opacity-0 pointer-events-none": !mobileMenuOpen,
                        }
                    )}
                >
                    <div className="container-xl py-4">
                        <nav className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <Button
                                    key={link.href}
                                    variant="ghost"
                                    asChild
                                    className={cn("justify-start hover:bg-primary hover:text-primary-foreground text-base md:text-lg font-bold", {
                                        "bg-muted": pathname === link.href,

                                    })}
                                >
                                    <Link
                                        to={link.href}
                                    >
                                        {link.label}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
