import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { destinationsApi } from '../api/destinations.api';
import { bookingsApi } from '../api/bookings.api';
import type { Destination } from '../types';

export const BookingForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Get travelers from location state or default to 1
    const initialTravelers = location.state?.travelers || 1;

    const [travelers, setTravelers] = useState(initialTravelers);
    const [startDate, setStartDate] = useState('');

    useEffect(() => {
        if (id) {
            fetchDestination(Number(id));
        }
    }, [id]);

    const fetchDestination = async (destinationId: number) => {
        try {
            setLoading(true);
            const data = await destinationsApi.getById(destinationId);
            setDestination(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to load destination');
            }
        } finally {
            setLoading(false);
        }
    };

    const calculateEndDate = (start: string): string => {
        const startDateObj = new Date(start);
        startDateObj.setDate(startDateObj.getDate() + 7); // Add 7 days
        return startDateObj.toISOString().split('T')[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (!startDate) {
            setError('Please select a start date');
            setSubmitting(false);
            return;
        }

        const endDate = calculateEndDate(startDate);

        try {
            await bookingsApi.create({
                destinationId: Number(id),
                startDate,
                endDate,
                travelers,
            });

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to create booking');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full size-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (error && !destination) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4 animate-bounce">✅</div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Booking Confirmed!</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Your trip has been successfully booked.</p>
                    <div className="animate-spin rounded-full size-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">Redirecting to your bookings...</p>
                </div>
            </div>
        );
    }

    const totalPrice = destination ? destination.price * travelers : 0;
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(`/destination/${id}`)}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                    >
                        <span className="text-xl mr-2">←</span>
                        <span className="font-medium">Back to Details</span>
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header Section */}
                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
                        <p className="text-blue-100">Just a few more details and you're all set!</p>
                    </div>

                    {/* Destination Summary */}
                    {destination && (
                        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={destination.imageUrl}
                                    alt={destination.name}
                                    className="size-20 rounded-lg object-cover"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{destination.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400">{destination.city}, {destination.country}</p>
                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">
                                        ${destination.price} / person
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Travelers */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Number of Travelers
                            </label>
                            <div className="flex items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold size-12 rounded-lg transition text-xl"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={travelers}
                                    onChange={(e) => setTravelers(Math.min(10, Math.max(1, Number(e.target.value))))}
                                    className="w-24 text-center px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setTravelers(Math.min(10, travelers + 1))}
                                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold size-12 rounded-lg transition text-xl"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Start Date */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                min={minDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            />
                        </div>

                        {/* End Date Display */}
                        {startDate && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">End Date:</span>
                                    <span className="text-gray-900 dark:text-white font-bold text-lg">{calculateEndDate(startDate)}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Trip duration: 7 days</p>
                            </div>
                        )}

                        {/* Price Summary */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Summary</h3>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>${destination?.price} × {travelers} {travelers === 1 ? 'person' : 'people'}</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-3 flex justify-between font-bold text-xl">
                                <span className="text-gray-900 dark:text-white">Total Amount</span>
                                <span className="text-blue-600 dark:text-blue-400">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Mock Payment Notice */}
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-2">💳 Mock Payment System</h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-500">
                                This is a demonstration booking system. No real payment will be processed.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-lg"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};