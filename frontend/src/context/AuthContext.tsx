import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '@/lib/keycloak';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    username: string | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

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

                console.log('Keycloak initialized, authenticated:', authenticated);
                console.log('Token:', keycloak.token);
                console.log('Token parsed:', keycloak.tokenParsed);

                if (authenticated) {
                    setIsAuthenticated(true);
                    setToken(keycloak.token || null);
                    setUsername(keycloak.tokenParsed?.preferred_username || null);
                }

                setInitialized(true);

                // Set up token refresh
                keycloak.onTokenExpired = () => {
                    console.log('Token expired, attempting refresh...');
                    keycloak.updateToken(70)
                        .then((refreshed) => {
                            console.log('Token refresh result:', refreshed);
                            if (refreshed) {
                                console.log('Token refreshed successfully');
                                setToken(keycloak.token || null);
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
                    setIsAuthenticated(true);
                    setToken(keycloak.token || null);
                    setUsername(keycloak.tokenParsed?.preferred_username || null);
                };

                // Set up auth error callback
                keycloak.onAuthError = (error) => {
                    console.error('Auth error:', error);
                    setIsAuthenticated(false);
                    setToken(null);
                    setUsername(null);
                };

                // Set up auth refresh success callback
                keycloak.onAuthRefreshSuccess = () => {
                    console.log('Auth refresh success');
                    setToken(keycloak.token || null);
                };

                // Set up auth refresh error callback
                keycloak.onAuthRefreshError = () => {
                    console.error('Auth refresh error');
                    keycloak.login();
                };

            } catch (error) {
                console.error('Failed to initialize Keycloak:', error);
                setInitialized(true);
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
            setIsAuthenticated(false);
            setToken(null);
            setUsername(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Only render children when Keycloak is initialized
    if (!initialized) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, username, login, logout }}>
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