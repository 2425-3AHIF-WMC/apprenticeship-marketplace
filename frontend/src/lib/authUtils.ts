export async function checkCompanyAuth(): Promise<boolean> {
    const token = localStorage.getItem("companyAccessToken");
    if (!token) {
        return false;
    }

    const isValid = await verifyAccessToken(token);
    if (isValid) {
        return true;
    }

    return await refreshToken();
}


async function verifyAccessToken(token: string): Promise<boolean> {
    try {
        const res = await fetch("http://localhost:5000/api/company/verify", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.ok;
    } catch {
        return false;
    }
}

async function refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem("companyRefreshToken");
    if (!refreshToken) {
        return false;
    }

    try {
        const res = await fetch("http://localhost:5000/api/company/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
            return false;
        }

        const data = await res.json();

        if (data.accessToken != null) {
            localStorage.setItem("companyAccessToken", data.accessToken);
            return true;
        }

        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
