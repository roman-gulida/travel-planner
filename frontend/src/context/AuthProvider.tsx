import { useState } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import { authApi } from '../api/auth.api';
import { AuthContext } from './AuthContext';

// Initialize state from localStorage outside component
const getInitialToken = (): string | null => {
    return localStorage.getItem('token');
};

const getInitialUser = (): User | null => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(getInitialUser);
    const [token, setToken] = useState<string | null>(getInitialToken);

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authApi.login(credentials);
            const jwtToken = response.token;

            // Decode JWT to get user info (basic decode, not verification)
            // JWT structure: { sub: "userId", role: "USER|ADMIN", iat: ..., exp: ... }
            const payload = JSON.parse(atob(jwtToken.split('.')[1]));

            const userData: User = {
                id: Number(payload.sub), // sub contains userId as string
                name: '', // Name is not in JWT, we'll need to fetch it or store during registration
                email: credentials.email, // Store email from login credentials
                role: payload.role, // "USER" or "ADMIN"
            };

            localStorage.setItem('token', jwtToken);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(jwtToken);
            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            await authApi.register(data);

            // After registration, auto-login
            await login({ email: data.email, password: data.password });

            // Update user with name after login
            setUser((currentUser) => {
                if (currentUser) {
                    const updatedUser = { ...currentUser, name: data.name };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    return updatedUser;
                }
                return currentUser;
            });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};