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
    try {
        const res = await fetch("http://localhost:5000/api/company/refresh", {
            method: "POST",
            credentials: 'include',
        });

        if (!res.ok) {
            return null;
        }


        const accessToken = res.headers.get('Authorization')?.split(' ')[1];
        if (accessToken != null) {
            localStorage.setItem("companyAccessToken", accessToken);
            return accessToken;
        }

        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function logoutCompany(): Promise<void> {
    try {
        const response = await fetch("http://localhost:5000/api/company/logout", {
            method: "POST",
            credentials: 'include',
        });

        if (response.ok) {
            localStorage.removeItem('companyAccessToken');
        }
    } catch (err) {
        console.error(err);
    }
}
