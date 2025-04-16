import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, token } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
        console.log('ProtectedRoute - token:', token ? 'present' : 'missing');
        console.log('ProtectedRoute - current location:', location.pathname);
        
        // Add a small delay to allow for token refresh
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, token, location]);

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated || !token) {
        console.log('ProtectedRoute - Redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 