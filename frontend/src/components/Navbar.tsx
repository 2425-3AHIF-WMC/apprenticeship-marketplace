import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {Menu, X, User, ChevronDown, LogOut, Building} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/ThemeProvider";
import { useAuth } from '@/context/AuthContext';
import {checkCompanyAuth} from "@/lib/authUtils.ts";


const Navbar = () => {
    const [, setIsScrolled] = useState(false);
    const { pathname } = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const { theme } = useTheme();
    const { studentIsAuthenticated, studentUsername, logout } = useAuth();
    const [companyName, setCompanyName] = useState<string | null>(null);
    const [companyIsAuthenticated, setCompanyIsAuthenticated] = useState(false);
    useEffect(() => {
        (async () => {
            const token = await checkCompanyAuth();
            if (!token) {
                setCompanyIsAuthenticated(false);
                setCompanyName(null);
                return;
            }

            const res = await fetch("http://localhost:5000/api/company/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res);
            if (res.ok) {
                const data = await res.json();
                console.log(data)
                setCompanyName(data.name);
                setCompanyIsAuthenticated(true);
            } else {
                setCompanyIsAuthenticated(false);
                setCompanyName("None");
            }
        })();
    }, []);



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

    const handleLogout = async () => {
        if (studentIsAuthenticated) {
            await logout();
        } else if (companyIsAuthenticated) {
            try {
                const response = await fetch("http://localhost:5000/api/company/logout", {
                    method: "POST",
                    credentials: 'include',
                });

                if (response.ok) {
                    setCompanyIsAuthenticated(false);
                    setCompanyName(null);
                    localStorage.removeItem('companyAccessToken');
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const logoSrc = theme === 'light' ? "/assets/htllogo-big-black.png" : "/assets/htllogo-big-white.png";


    const displayName = studentIsAuthenticated ? studentUsername : (companyIsAuthenticated ? companyName : null);
    const dashboardLink =
        studentIsAuthenticated ? (studentUsername === 'if220183' ? '/admin/dashboard' : '/student/dashboard') : companyIsAuthenticated ? "/company/dashboard" : null;

    return (
        <header
            className=
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/40 backdrop-blur-md shadow-sm"
        >
            <div className="container-xl max-w-full">
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
                        <Button
                            key="/"
                            variant="ghost"
                            asChild
                            className={cn(
                                "hover:bg-primary hover:text-primary-foreground text-base md:text-lg font-bold",
                                pathname === "/" ? "text-primary font-bold" : ""
                            )}
                        >
                            <Link to="/">Home</Link>
                        </Button>
                        {studentIsAuthenticated && (
                            <Button
                                key="/internships"
                                variant="ghost"
                                asChild
                                className={cn(
                                    "hover:bg-primary hover:text-primary-foreground text-base md:text-lg font-bold",
                                    pathname === "/internships" ? "text-primary font-bold" : ""
                                )}
                            >
                                <Link to="/internships">Praktika</Link>
                            </Button>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {studentIsAuthenticated || companyIsAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-2 px-2 md:px-4">
                                        { studentIsAuthenticated ?
                                        <User className="h-4 w-4" /> : <Building className="h-4 w-4"/>
                                        }
                                        {!isMobile && displayName}
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-popover">

                                    {dashboardLink && (
                                        <DropdownMenuItem asChild>
                                            <Link to={dashboardLink}>Dashboard</Link>
                                        </DropdownMenuItem>
                                    )}
                                    {studentIsAuthenticated && (
                                        <DropdownMenuItem asChild>
                                            <Link to="/internships">Praktika</Link>
                                        </DropdownMenuItem>
                                    )}
                                    {(studentIsAuthenticated || companyIsAuthenticated) && (
                                        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Abmelden
                                        </DropdownMenuItem>)}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) :
                            (<Button asChild variant="default">
                                <Link to="/login" className="text-base font-bold">
                                    <User className="h-8 w-8 md:mr-2" />
                                    {!isMobile && "Anmelden"}
                                </Link>
                            </Button>)}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
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
                            <Button
                                key="/"
                                variant="ghost"
                                asChild
                                className={cn("justify-start hover:bg-primary hover:text-primary-foreground text-base md:text-lg font-bold", {
                                    "bg-muted": pathname === "/",
                                })}
                            >
                                <Link to="/">Home</Link>
                            </Button>
                            {studentIsAuthenticated && (
                                <Button
                                    key="/internships"
                                    variant="ghost"
                                    asChild
                                    className={cn("justify-start hover:bg-primary hover:text-primary-foreground text-base md:text-lg font-bold", {
                                        "bg-muted": pathname === "/internships",
                                    })}
                                >
                                    <Link to="/internships">Praktika</Link>
                                </Button>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
