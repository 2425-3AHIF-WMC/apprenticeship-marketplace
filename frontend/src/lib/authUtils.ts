export async function checkCompanyAuth(): Promise<string | null> {
    const token = localStorage.getItem("companyAccessToken");
    if (!token) {
        return null;
    }

    const isValid = await verifyAccessToken(token);
    if (isValid) {
        return token;
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

async function refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem("companyRefreshToken");
    if (!refreshToken) {
        return null;
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
            return null;
        }

        const data = await res.json();

        if (data.accessToken != null) {
            localStorage.setItem("companyAccessToken", data.accessToken);
            return data.accessToken;
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}
