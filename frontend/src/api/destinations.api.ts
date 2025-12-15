import axiosInstance from './axios';
import type { Destination, CreateDestinationRequest } from '../types';

export const destinationsApi = {
    getAll: async (): Promise<Destination[]> => {
        const response = await axiosInstance.get<Destination[]>('/destinations');
        return response.data;
    },

    getById: async (id: number): Promise<Destination> => {
        const response = await axiosInstance.get<Destination>(`/destinations/${id}`);
        return response.data;
    },

    create: async (data: CreateDestinationRequest): Promise<Destination> => {
        const response = await axiosInstance.post<Destination>('/destinations', data);
        return response.data;
    },

    update: async (id: number, data: CreateDestinationRequest): Promise<Destination> => {
        const response = await axiosInstance.put<Destination>(`/destinations/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/destinations/${id}`);
    },
};