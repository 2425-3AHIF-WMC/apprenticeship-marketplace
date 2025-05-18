import { useEffect, useState } from "react";
import {checkCompanyAuth} from "@/lib/authUtils.ts";

export const useCompanyAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await checkCompanyAuth();
            setIsAuthenticated(token != null);
        };
        checkAuth();
    }, []);

    return isAuthenticated;
};