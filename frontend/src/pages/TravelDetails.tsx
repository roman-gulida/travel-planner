import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { destinationsApi } from '../api/destinations.api';
import type { Destination } from '../types';

export const TravelDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [travelers, setTravelers] = useState(1);

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

    const handleBookNow = () => {
        if (destination) {
            navigate(`/booking/${destination.id}`, { state: { travelers } });
        }
    };

    if (loading) {
        return <div>Loading destination details...</div>;
    }

    if (error || !destination) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Destination Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'This destination does not exist'}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const totalPrice = destination.price * travelers;

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
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Image & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Image */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                                src={destination.imageUrl || 'https://via.placeholder.com/800x400'}
                                alt={destination.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Title & Location */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {destination.name}
                            </h1>

                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-lg mb-4">
                                <span className="text-2xl mr-2">📍</span>
                                <span>{destination.city}, {destination.country}</span>
                            </div>

                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                    ${destination.price}
                                </span>
                                <span className="text-xl text-gray-500 dark:text-gray-500 ml-2">/ person</span>
                            </div>

                            {/* Description */}
                            <div className="prose dark:prose-invert max-w-none">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">About This Trip</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {destination.description || 'No description available.'}
                                </p>
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                <span className="mr-2">ℹ️</span> Trip Information
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <span className="text-2xl mr-3">⏱️</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Duration</h3>
                                        <p className="text-gray-600 dark:text-gray-400">1 week (7 days)</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-2xl mr-3">📅</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Flexible Dates</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Choose your preferred start date when booking</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-2xl mr-3">👥</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Group Size</h3>
                                        <p className="text-gray-600 dark:text-gray-400">From 1 to 10 travelers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 lg:sticky lg:top-24">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book Your Trip</h2>

                            {/* Travelers Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Number of Travelers
                                </label>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold size-10 rounded-lg transition"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={travelers}
                                        onChange={(e) => setTravelers(Math.min(10, Math.max(1, Number(e.target.value))))}
                                        className="w-20 text-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => setTravelers(Math.min(10, travelers + 1))}
                                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold size-10 rounded-lg transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6 space-y-2">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>${destination.price} × {travelers} {travelers === 1 ? 'person' : 'people'}</span>
                                    <span>${(destination.price * travelers).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-bold text-lg">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-blue-600 dark:text-blue-400">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                onClick={handleBookNow}
                                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                            >
                                Book Now →
                            </button>

                            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
                                Free cancellation up to 24 hours before departure
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};