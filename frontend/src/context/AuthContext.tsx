import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'approver';
    pfpUrl?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (name: string, email: string, pass: string, role: string) => Promise<void>;
    logout: () => void;
    updateProfile: (token: string, user: User) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Very simple session recovery from local storage (Decode JWT in real app, but for MVP we cache user)
            try {
                const cachedUser = localStorage.getItem('user');
                if (cachedUser) {
                    const parsedUser = JSON.parse(cachedUser);
                    // Validate roles otherwise wipe session (useful when we swapped 'client' for 'user')
                    if (['admin', 'user', 'approver'].includes(parsedUser.role)) {
                        setUser(parsedUser);
                    } else {
                        logout();
                    }
                } else {
                    logout();
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string) => {
        const { data } = await api.post('/auth/login', { email, password: pass });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const register = async (name: string, email: string, pass: string, role: string) => {
        const { data } = await api.post('/auth/register', { name, email, password: pass, role });
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const updateProfile = (newToken: string, updatedUser: User) => {
        setToken(newToken);
        setUser(updatedUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
