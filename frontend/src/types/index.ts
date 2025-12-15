export interface User {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface Destination {
    id: number;
    name: string;
    country: string;
    city: string;
    description: string;
    imageUrl: string;
    price: number;
}

export interface BookingRequest {
    destinationId: number;
    startDate: string; // ISO date string (YYYY-MM-DD)
    endDate: string;   // ISO date string (YYYY-MM-DD)
    travelers: number;
}

export interface BookingResponse {
    id: number;
    destination: Destination;
    startDate: string;
    endDate: string;
    travelers: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    createdAt: string;
}

export interface CreateDestinationRequest {
    name: string;
    country: string;
    city: string;
    description: string;
    imageUrl: string;
    price: number;
}

export interface FilterOptions {
    search?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'name' | 'country';
    sortOrder?: 'asc' | 'desc';
}