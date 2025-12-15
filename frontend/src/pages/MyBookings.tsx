import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsApi } from '../api/bookings.api';
import type { BookingResponse } from '../types';

export const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingsApi.getMyBookings();
            setBookings(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to load bookings');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: number) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await bookingsApi.cancel(bookingId);
            alert('Booking cancelled successfully');
            fetchBookings();
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message || 'Failed to cancel booking');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return '✅';
            case 'CANCELLED': return '❌';
            case 'PENDING': return '⏳';
            default: return '📋';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full size-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        <span className="text-xl mr-2">←</span>
                        <span className="font-medium">Back to Dashboard</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                        <span className="mr-3">📋</span> My Bookings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">View and manage your travel bookings</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                        <div className="text-6xl mb-4">🌴</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Bookings Yet</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Start planning your next adventure!</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                        >
                            Browse Destinations
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
                            >
                                <div className="md:flex">
                                    {/* Image */}
                                    <div className="md:w-64 md:shrink-0">
                                        <img
                                            src={booking.destination.imageUrl}
                                            alt={booking.destination.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {booking.destination.name}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 flex items-center">
                                                    <span className="mr-1">📍</span>
                                                    {booking.destination.city}, {booking.destination.country}
                                                </p>
                                            </div>

                                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                                <span className="mr-1">{getStatusIcon(booking.status)}</span>
                                                {booking.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">Booking ID</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">#{booking.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">Travelers</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">👥 {booking.travelers}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">Start Date</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date(booking.startDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">End Date</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date(booking.endDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-500">Total Price</p>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    ${(booking.destination.price * booking.travelers).toFixed(2)}
                                                </p>
                                            </div>

                                            {booking.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition"
                                                >
                                                    Cancel Booking
                                                </button>
                                            )}

                                            {booking.status === 'CONFIRMED' && (
                                                <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                                                    <span className="mr-2">✓</span> Confirmed
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                                            Booked on {new Date(booking.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};