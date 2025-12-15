import axiosInstance from './axios';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authApi = {
    register: async (data: RegisterRequest): Promise<User> => {
        const response = await axiosInstance.post<User>('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    // Note: Your backend doesn't have /me endpoint yet
    // You might need to add it or decode JWT on frontend
    getCurrentUser: async (): Promise<User> => {
        // If you add GET /api/auth/me endpoint in backend
        const response = await axiosInstance.get<User>('/auth/me');
        return response.data;
    },
};