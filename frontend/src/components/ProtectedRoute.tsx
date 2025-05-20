import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { studentIsAuthenticated, studentToken, studentUsername } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Wait for Keycloak to initialize and check authentication
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Increased timeout to ensure Keycloak has time to initialize

        return () => clearTimeout(timer);
    }, [studentIsAuthenticated, studentToken, location]);

    // Show loading state while checking authentication
    if (isLoading) {
        return null;
    }

    // Only redirect if we're sure the user is not authenticated
    if (!studentIsAuthenticated || !studentToken) {
        return <Navigate to="/access-denied" state={{ from: location }} replace />;
    }

    // Admin route protection
    if (location.pathname.startsWith('/admin')) {
        if (studentUsername !== 'if220183') {
            return <Navigate to="/access-denied" state={{ from: location }} replace />;
        }
    }

    // Student route protection
    if (location.pathname.startsWith('/student')) {
        if (studentUsername === 'if220183') {
            return <Navigate to="/access-denied" state={{ from: location }} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute; 