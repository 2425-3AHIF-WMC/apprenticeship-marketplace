import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '@/lib/keycloak';

interface AuthContextType {
    studentIsAuthenticated: boolean;
    studentToken: string | null;
    studentUsername: string | null;
    studentName: string | null;
    studentId: number | null;
    studentMail: string | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [studentIsAuthenticated, setStudentIsAuthenticated] = useState(false);
    const [studentToken, setStudentToken] = useState<string | null>(null);
    const [studentUsername, setStudentUsername] = useState<string | null>(null);
    const [studentName, setStudentName] = useState<string | null>(null);
    const [studentMail, setStudentMail] = useState<string | null>(null);
    const [studentInitialized, setStudentInitialized] = useState(false);
    const [studentId, setStudentId] = useState<number | null>(null);

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                const authenticated = await keycloak.init({
                    onLoad: 'check-sso',
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    checkLoginIframe: false,
                    enableLogging: true,
                    pkceMethod: 'S256',
                    flow: 'standard'
                });


                if (authenticated) {
                    setStudentIsAuthenticated(true);
                    setStudentToken(keycloak.token || null);
                    const username = keycloak.tokenParsed?.preferred_username || null;
                    setStudentUsername(username);
                    const mail = keycloak.tokenParsed?.email || null;
                    setStudentMail(mail);
                    // Get the student's name from the token
                    const name = keycloak.tokenParsed?.name || null;
                    setStudentName(name);
                    console.log(keycloak.tokenParsed)
                    if (username && mail) {
                        await ensureStudentAndFetchId(username, mail);
                    } else {
                        setStudentId(null);
                    }

                    // Set up token refresh
                    keycloak.onTokenExpired = () => {
                        console.log('Token expired, attempting refresh...');
                        keycloak.updateToken(70)
                            .then((refreshed) => {
                                if (refreshed) {
                                    console.log('Token refreshed successfully');
                                    setStudentToken(keycloak.token || null);
                                    setStudentName(keycloak.tokenParsed?.name || null);
                                    setStudentMail(keycloak.tokenParsed?.email || null);
                                } else {
                                    console.log('Token refresh failed');
                                    setStudentIsAuthenticated(false);
                                    setStudentToken(null);
                                    setStudentUsername(null);
                                    setStudentName(null);
                                    setStudentMail(null);
                                    setStudentId(null);
                                }
                            })
                            .catch((error) => {
                                console.error('Token refresh error:', error);
                                setStudentIsAuthenticated(false);
                                setStudentToken(null);
                                setStudentUsername(null);
                                setStudentName(null);
                                setStudentMail(null);
                                setStudentId(null);
                            });
                    };
                } else {
                    console.log('User is not authenticated');
                    setStudentIsAuthenticated(false);
                    setStudentToken(null);
                    setStudentUsername(null);
                    setStudentName(null);
                    setStudentMail(null);
                    setStudentId(null);
                }

                setStudentInitialized(true);

                // Set up auth success callback
                keycloak.onAuthSuccess = async () => {
                    console.log('Auth success');
                    setStudentIsAuthenticated(true);
                    setStudentToken(keycloak.token || null);
                    setStudentUsername(keycloak.tokenParsed?.preferred_username || null);
                    setStudentName(keycloak.tokenParsed?.name || null);
                    setStudentMail(keycloak.tokenParsed?.email || null);
                    await ensureStudentAndFetchId(keycloak.tokenParsed?.preferred_username || null, keycloak.tokenParsed?.email || null);
                };

                // Set up auth error callback
                keycloak.onAuthError = (error) => {
                    console.error('Auth error:', error);
                    setStudentIsAuthenticated(false);
                    setStudentToken(null);
                    setStudentUsername(null);
                    setStudentName(null);
                    setStudentMail(null);
                    setStudentId(null);
                };

                // Set up auth refresh success callback
                keycloak.onAuthRefreshSuccess = async () => {
                    console.log('Auth refresh success');
                    setStudentIsAuthenticated(true);
                    setStudentToken(keycloak.token || null);
                    setStudentName(keycloak.tokenParsed?.name || null);
                    setStudentMail(keycloak.tokenParsed?.email || null);
                    setStudentUsername(keycloak.tokenParsed?.preferred_username || null);
                    await ensureStudentAndFetchId(keycloak.tokenParsed?.preferred_username || null, keycloak.tokenParsed?.email || null);
                };

                // Set up auth refresh error callback
                keycloak.onAuthRefreshError = () => {
                    console.error('Auth refresh error');
                    setStudentIsAuthenticated(false);
                    setStudentToken(null);
                    setStudentUsername(null);
                    setStudentName(null);
                    setStudentMail(null);
                    setStudentId(null);
                };

            } catch (error) {
                console.error('Failed to initialize Keycloak:', error);
                setStudentInitialized(true);
            }
        };

        initKeycloak();
    }, []);

    const login = async () => {
        try {
            console.log('Attempting login...');
            await keycloak.login();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        try {
            console.log('Attempting logout...');
            await keycloak.logout();
            setStudentIsAuthenticated(false);
            setStudentToken(null);
            setStudentUsername(null);
            setStudentName(null);
            setStudentMail(null);
            setStudentId(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const ensureStudentAndFetchId = async (username: string, mail : string) => {
        if (!username || !mail) {
            setStudentId(null);
            return;
        }
        try {
            // Try to create the user
            const createRes = await fetch('http://localhost:5000/api/student/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, mail }),
            });
            if (createRes.status !== 201 && createRes.status !== 409) {
                alert('User creation unsuccessful!');
                setStudentId(null);
            } else {
                // Fetch the studentId
                const idRes = await fetch(`http://localhost:5000/api/student/by-username/${username}`);
                if (idRes.ok) {
                    const student = await idRes.json();
                    setStudentId(student.person_id || student.studentId || null);
                } else {
                    alert('Could not fetch student ID!');
                    setStudentId(null);
                }
            }
        } catch (err) {
            alert('User creation or ID fetch failed!');
            setStudentId(null);
        }
    };

    // Only render children when Keycloak is initialized
    if (!studentInitialized) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ 
            studentIsAuthenticated, 
            studentToken, 
            studentUsername,
            studentName,
            studentId,
            studentMail,
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 