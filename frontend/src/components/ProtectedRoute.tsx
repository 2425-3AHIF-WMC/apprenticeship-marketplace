import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/lib/authUtils';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { studentIsAuthenticated, studentToken, studentId } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        // Wait for Keycloak to initialize and check authentication
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Increased timeout to ensure Keycloak has time to initialize

        if (studentId) {
            isAdmin(studentId).then(setIsAdminUser);
        }

        return () => clearTimeout(timer);
    }, [studentIsAuthenticated, studentToken, location, studentId]);

    // Show loading state while checking authentication or admin status
    if (isLoading || (location.pathname.startsWith('/admin') || location.pathname.startsWith('/student')) && isAdminUser === null) {
        return null;
    }

    // Only redirect if we're sure the user is not authenticated
    if (!studentIsAuthenticated || !studentToken) {
        return <Navigate to="/access-denied" state={{ from: location }} replace />;
    }

    // Admin route protection
    if (location.pathname.startsWith('/admin')) {
        if (!isAdminUser) {
            return <Navigate to="/access-denied" state={{ from: location }} replace />;
        }
    }

    // Student route protection
    if (location.pathname.startsWith('/student')) {
        if (isAdminUser) {
            return <Navigate to="/access-denied" state={{ from: location }} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute; 