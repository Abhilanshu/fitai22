'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    id: string; // Alias for _id
    name: string;
    email: string;
    xp: number;
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    fitness_goal?: string;
    activity_level?: string;
    totalWorkouts?: number;
    badges?: Array<{
        name: string;
        dateEarned: string;
        icon: string;
        description: string;
    }>;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    refreshUser: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Set default header for all requests
                api.defaults.headers.common['x-auth-token'] = token;

                const res = await api.get('/auth');
                setUser({ ...res.data, id: res.data._id });
            } catch (err) {
                console.error('Auth Load Error:', err);
                localStorage.removeItem('token');
                delete api.defaults.headers.common['x-auth-token'];
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const refreshUser = async () => {
        try {
            const res = await api.get('/auth');
            setUser({ ...res.data, id: res.data._id });
        } catch (err) {
            console.error(err);
        }
    };

    const login = (token: string) => {
        localStorage.setItem('token', token);
        api.defaults.headers.common['x-auth-token'] = token;
        refreshUser().then(() => router.push('/dashboard'));
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['x-auth-token'];
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
