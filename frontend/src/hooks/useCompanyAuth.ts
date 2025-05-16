import { useEffect, useState } from "react";

export const useCompanyAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem("companyAccessToken");
            const refreshToken = localStorage.getItem("companyRefreshToken");
            if (!accessToken) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:5000/api/company/verify", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (res.ok) {
                    setIsAuthenticated(true);
                    return;
                }

                if(!refreshToken) {
                    setIsAuthenticated(false);
                    return;
                }

                const refreshRes = await fetch("http://localhost:5000/api/company/refresh", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken }),
                });
                if (!refreshRes.ok) {
                    setIsAuthenticated(false);
                    return;
                }

                const data = await refreshRes.json();
                localStorage.setItem("companyAccessToken", data.accessToken);
                setIsAuthenticated(true);

            } catch (err) {
                console.log(err);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return isAuthenticated;
};