import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsApi } from '../api/bookings.api';
import type { BookingResponse } from '../types';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export const AdminBookings: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let result = [...bookings];

            // Status filter
            if (statusFilter !== 'ALL') {
                result = result.filter((booking) => booking.status === statusFilter);
            }

            // Search by destination name
            if (searchTerm) {
                result = result.filter((booking) =>
                    booking.destination.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setFilteredBookings(result);
        };
        applyFilters();
    }, [bookings, statusFilter, searchTerm]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await bookingsApi.getAllBookings();
            setBookings(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to load bookings');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId: number, newStatus: BookingStatus) => {
        if (!window.confirm(`Change status to ${newStatus}?`)) {
            return;
        }

        try {
            await bookingsApi.updateStatus(bookingId, newStatus);
            alert(`Booking status updated to ${newStatus}`);
            fetchBookings();
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message || 'Failed to update booking status');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return '#28a745'; // Green
            case 'CANCELLED':
                return '#dc3545'; // Red
            case 'PENDING':
                return '#ffc107'; // Yellow
            default:
                return '#6c757d'; // Gray
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
                    <div className="animate-spin rounded-full size-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading bookings...</p>
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
                        <span className="mr-3">📊</span> Booking Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">View and manage all user bookings</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">🔍</span> Filters
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Search by destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">⏳ Pending</option>
                            <option value="CONFIRMED">✅ Confirmed</option>
                            <option value="CANCELLED">❌ Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-3xl mb-2">📋</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-md p-6 border border-green-200 dark:border-green-800">
                        <div className="text-3xl mb-2">✅</div>
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            {bookings.filter(b => b.status === 'CONFIRMED').length}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-500">Confirmed</div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-md p-6 border border-yellow-200 dark:border-yellow-800">
                        <div className="text-3xl mb-2">⏳</div>
                        <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                            {bookings.filter(b => b.status === 'PENDING').length}
                        </div>
                        <div className="text-sm text-yellow-600 dark:text-yellow-500">Pending</div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-md p-6 border border-red-200 dark:border-red-800">
                        <div className="text-3xl mb-2">❌</div>
                        <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                            {bookings.filter(b => b.status === 'CANCELLED').length}
                        </div>
                        <div className="text-sm text-red-600 dark:text-red-500">Cancelled</div>
                    </div>
                </div>

                {/* Bookings List */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Bookings <span className="text-purple-600 dark:text-purple-400">({filteredBookings.length})</span>
                    </h2>

                    {filteredBookings.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-xl text-gray-600 dark:text-gray-400">No bookings found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mr-3">
                                                    {booking.destination.name}
                                                </h3>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                                    <span className="mr-1">{getStatusIcon(booking.status)}</span>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 flex items-center mb-3">
                                                <span className="mr-1">📍</span>
                                                {booking.destination.city}, {booking.destination.country}
                                            </p>

                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">Booking ID</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">#{booking.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">Travelers</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">👥 {booking.travelers}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">Start Date</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {new Date(booking.startDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">End Date</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-500">Total Price</p>
                                                    <p className="font-bold text-purple-600 dark:text-purple-400">
                                                        ${(booking.destination.price * booking.travelers).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        {booking.status !== 'CONFIRMED' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
                                            >
                                                ✅ Confirm
                                            </button>
                                        )}

                                        {booking.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white text-sm font-medium rounded-lg transition"
                                            >
                                                ❌ Cancel
                                            </button>
                                        )}

                                        {booking.status !== 'PENDING' && (
                                            <button
                                                onClick={() => handleUpdateStatus(booking.id, 'PENDING')}
                                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition"
                                            >
                                                ⏳ Set Pending
                                            </button>
                                        )}

                                        <div className="ml-auto text-xs text-gray-500 dark:text-gray-500 self-center">
                                            Booked: {new Date(booking.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};