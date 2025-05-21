import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Building,
  ShieldCheck,
  BriefcaseBusiness,
  Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
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

const AdminDashboardSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const path = window.location.pathname;
  const { studentName, logout } = useAuth();  

  // For now, hardcode admin name; later, fetch from context or token
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      navigate('/');
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
            <h3 className="font-semibold text-center">{studentName || "Admin"}</h3>
            <p className="text-md text-muted-foreground text-center">HTL Leonding</p>
          </div>
        </div>
        <nav className="space-y-1.5 flex-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            to="/admin/dashboard" 
            active={path === '/admin/dashboard'} 
          />
          <SidebarItem 
            icon={BriefcaseBusiness} 
            label="Alle Praktika" 
            to="/admin/internships"
            active={path === '/admin/internships'}
          />
          <SidebarItem 
            icon={Building} 
            label="Alle Unternehmen"
            to="/admin/companies"
            active={path === '/admin/companies'}
          />
          <SidebarItem 
            icon={ShieldCheck} 
            label="Zu Verifizieren"
            to="/admin/companies/verify"
            active={path === '/admin/companies/verify'}
          />
          <SidebarItem 
            icon={Home} 
            label="Zurück zu den Praktika"
            to="/internships"
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

export default AdminDashboardSidebar; 