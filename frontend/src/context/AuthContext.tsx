import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '@/lib/keycloak';

interface AuthContextType {
    studentIsAuthenticated: boolean;
    studentToken: string | null;
    studentUsername: string | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [studentIsAuthenticated, setStudentIsAuthenticated] = useState(false);
    const [studentToken, setStudentToken] = useState<string | null>(null);
    const [studentUsername, setStudentUsername] = useState<string | null>(null);
    const [studentInitialized, setStudentInitialized] = useState(false);

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                console.log('Initializing Keycloak...');
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
                    setStudentUsername(keycloak.tokenParsed?.preferred_username || null);
                }

                setStudentInitialized(true);

                // Set up token refresh
                keycloak.onTokenExpired = () => {
                    console.log('Token expired, attempting refresh...');
                    keycloak.updateToken(70)
                        .then((refreshed) => {
                            console.log('Token refresh result:', refreshed);
                            if (refreshed) {
                                console.log('Token refreshed successfully');
                                setStudentToken(keycloak.token || null);
                            } else {
                                console.log('Token refresh failed, forcing login');
                                keycloak.login();
                            }
                        })
                        .catch((error) => {
                            console.error('Token refresh error:', error);
                            keycloak.login();
                        });
                };

                // Set up auth success callback
                keycloak.onAuthSuccess = () => {
                    console.log('Auth success');
                    setStudentIsAuthenticated(true);
                    setStudentToken(keycloak.token || null);
                    setStudentUsername(keycloak.tokenParsed?.preferred_username || null);
                };

                // Set up auth error callback
                keycloak.onAuthError = (error) => {
                    console.error('Auth error:', error);
                    setStudentIsAuthenticated(false);
                    setStudentToken(null);
                    setStudentUsername(null);
                };

                // Set up auth refresh success callback
                keycloak.onAuthRefreshSuccess = () => {
                    console.log('Auth refresh success');
                    setStudentToken(keycloak.token || null);
                };

                // Set up auth refresh error callback
                keycloak.onAuthRefreshError = () => {
                    console.error('Auth refresh error');
                    keycloak.login();
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
        } catch (error) {
            console.error('Logout failed:', error);
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