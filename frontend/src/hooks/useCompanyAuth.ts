import { useEffect, useState } from "react";

export const useCompanyAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("companyAccessToken");
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:5000/api/company/verify", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setIsAuthenticated(res.ok);
            } catch (err) {
                console.log(err);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return isAuthenticated;
};