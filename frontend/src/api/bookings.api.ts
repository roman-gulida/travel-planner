import axiosInstance from './axios';
import type { BookingRequest, BookingResponse } from '../types';

export const bookingsApi = {
    create: async (data: BookingRequest): Promise<BookingResponse> => {
        const response = await axiosInstance.post<BookingResponse>('/bookings', data);
        return response.data;
    },

    getMyBookings: async (): Promise<BookingResponse[]> => {
        const response = await axiosInstance.get<BookingResponse[]>('/bookings');
        return response.data;
    },

    getById: async (id: number): Promise<BookingResponse> => {
        const response = await axiosInstance.get<BookingResponse>(`/bookings/${id}`);
        return response.data;
    },

    cancel: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/bookings/${id}`);
    },

    // Admin endpoints
    getAllBookings: async (): Promise<BookingResponse[]> => {
        const response = await axiosInstance.get<BookingResponse[]>('/bookings/admin');
        return response.data;
    },

    updateStatus: async (id: number, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'): Promise<BookingResponse> => {
        const response = await axiosInstance.patch<BookingResponse>(
            `/bookings/admin/${id}/status`,
            null,
            { params: { status } }
        );
        return response.data;
    },
};