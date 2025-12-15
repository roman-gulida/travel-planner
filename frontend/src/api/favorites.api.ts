import axiosInstance from './axios';
import type { Destination } from '../types';

export interface FavoriteRequest {
    destinationId: number;
}

export interface FavoriteResponse {
    id: number;
    userId: number;
    destination: Destination;
}

export const favoritesApi = {
    getAll: async (): Promise<FavoriteResponse[]> => {
        const response = await axiosInstance.get<FavoriteResponse[]>('/favorites');
        return response.data;
    },

    add: async (destinationId: number): Promise<FavoriteResponse> => {
        const response = await axiosInstance.post<FavoriteResponse>('/favorites', {
            destinationId,
        });
        return response.data;
    },

    remove: async (favoriteId: number): Promise<void> => {
        await axiosInstance.delete(`/favorites/${favoriteId}`);
    },

    removeByDestination: async (destinationId: number): Promise<void> => {
        await axiosInstance.delete(`/favorites/by-destination/${destinationId}`);
    },
};