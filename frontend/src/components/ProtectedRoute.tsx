import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdmin, fetchCompanyProfile, checkCompanyAuth } from '@/lib/authUtils';

export type UserRole = 'student' | 'admin' | 'company';

interface ProtectedRouteProps {
    children: ReactNode;
    allow: UserRole[];
}

const ProtectedRoute = ({ children, allow }: ProtectedRouteProps) => {
    const { studentIsAuthenticated, studentToken, studentId } = useAuth();
    const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
    const [companyId, setCompanyId] = useState<number | null>(null);
    const [companyIsAuthenticated, setCompanyIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [companyCheck, setCompanyCheck] = useState<'pending' | 'allowed' | 'denied'>('pending');
    const location = useLocation();
    const params = useParams();

    // Determine admin/company status
    useEffect(() => {
        let mounted = true;
        setIsLoading(true);
        (async () => {
            // Check admin
            if (studentId) {
                const admin = await isAdmin(studentId);
                if (mounted) setIsAdminUser(admin);
            } else {
                if (mounted) setIsAdminUser(false);
            }
            // Check company
            const token = await checkCompanyAuth();
            if (token) {
                const profile = await fetchCompanyProfile();
                if (profile && mounted) {
                    setCompanyId(profile.company_id);
                    setCompanyIsAuthenticated(true);
                } else if (mounted) {
                    setCompanyId(null);
                    setCompanyIsAuthenticated(false);
                }
            } else if (mounted) {
                setCompanyId(null);
                setCompanyIsAuthenticated(false);
            }
            setIsLoading(false);
        })();
        return () => { mounted = false; };
    }, [studentId]);

    // Compute user role (not in state)
    let userRole: UserRole | null = null;
    if (studentIsAuthenticated && studentToken) {
        userRole = isAdminUser ? 'admin' : 'student';
    } else if (companyIsAuthenticated && companyId) {
        userRole = 'company';
    }

    // Company check for /internships/:id
    useEffect(() => {
        if (
            location.pathname.match(/^\/internships\/[\w-]+$/) &&
            userRole === 'company' &&
            allow.includes('company') &&
            companyId &&
            params.id
        ) {
            setCompanyCheck('pending');
            (async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/internship/isOfCompany?internship_id=${params.id}&company_id=${companyId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const data = await response.json();
                    console.log(data)
                    setCompanyCheck(data.isOfCompany === true ? 'allowed' : 'denied');
                } catch {
                    setCompanyCheck('denied');
                }
            })();
        } else {
            setCompanyCheck('pending');
        }
    }, [location.pathname, userRole, allow, companyId, params.id]);

    // Show loading state while checking authentication or admin/company status
    if (isLoading || isAdminUser === null || companyIsAuthenticated === null) {
        return null;
    }

    // Special case: /internships/:id for company
    if (
        location.pathname.match(/^\/internships\/[\w-]+$/) &&
        userRole === 'company' &&
        allow.includes('company')
    ) {
        if (companyCheck === 'pending') return null;
        if (companyCheck === 'allowed') return <>{children}</>;
        return <Navigate to="/access-denied" state={{ from: location }} replace />;
    }

    // If user role is allowed
    if (userRole && allow.includes(userRole)) {
        return <>{children}</>;
    }

    // Not allowed
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
};

export default ProtectedRoute; 