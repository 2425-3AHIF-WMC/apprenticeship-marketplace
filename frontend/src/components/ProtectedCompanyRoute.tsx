import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";

interface Props {
    children: ReactNode;
}

const CompanyProtectedRoute = ({ children }: Props) => {
    const isAuthenticated = useCompanyAuth();
    const location = useLocation();

    if (isAuthenticated === null) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/access-denied" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default CompanyProtectedRoute;
