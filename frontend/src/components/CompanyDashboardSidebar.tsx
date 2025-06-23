import {useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Plus,
    Files,
    Settings,
    Home
} from 'lucide-react';
import {fetchCompanyProfile, logoutCompany} from "@/lib/authUtils.ts";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    to: string;
    active?: boolean;
}

interface CompanyDashboardSidebarProps {
    companyName?: string | null;
}

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => (
    <Link to={to} className="w-full">
        <div
            className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
                active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </div>
    </Link>
);

const CompanyDashboardSidebar = ({ companyName: companyNameProp }: CompanyDashboardSidebarProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const path = window.location.pathname;
    const [companyName, setCompanyName] = useState<string | null>(companyNameProp ?? null);
    const [loading, setLoading] = useState(companyNameProp === undefined);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutCompany();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        if (companyNameProp !== undefined) {
            setCompanyName(companyNameProp);
            setLoading(false);
            return;
        }
        const loadData = async () => {
            const data = await fetchCompanyProfile();
            setCompanyName(data ? data.name : null);
            setLoading(false);
        };
        loadData();
    }, [companyNameProp]);

    if (loading) {
        return null;
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-2 left-2 z-[100]">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="rounded-full bg-background shadow-md"
                >
                    {sidebarOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-[90]"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar */}
            <aside
                className={cn(
                    "w-full md:w-64 bg-card border-r border-border p-4 flex flex-col h-screen fixed md:sticky top-0 left-0 z-[95] transition-all duration-300 ease-in-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex items-center justify-center gap-2 mb-8 mt-8 md:mt-2">
                    <div>
                        <h3 className="font-semibold text-center">{companyName}</h3>
                        <p className="text-md text-muted-foreground text-center">HTL Leonding</p>
                    </div>
                </div>
                <nav className="space-y-1.5 flex-1">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        to="/company/dashboard"
                        active={path === '/company/dashboard'}
                    />
                    <SidebarItem
                        icon={Files}
                        label="Meine Praktikas"
                        to="/company/internships"
                        active={path === '/company/internships'}
                    />
                    <SidebarItem
                        icon={Plus}
                        label="Praktika erstellen"
                        to="/company/internship/create"
                        active={path === '/company/internship/create'}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Einstellungen"
                        to="/company/settings"
                        active={path === '/company/settings'}
                    />
                    <SidebarItem
                        icon={Home}
                        label="Zurück zur Startseite"
                        to="/"
                    />
                </nav>
                <div className="pt-4 border-t border-border">
                    <Button variant="outline" className="w-full justify-start border-none" onClick={handleLogout}>
                        <LogOut className="h-5 w-5 mr-2" />
                        <span>Abmelden</span>
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default CompanyDashboardSidebar;