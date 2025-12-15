// src/pages/Favorites/Favorites.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoritesApi, type FavoriteResponse } from '../api/favorites.api';
import { TravelCard } from '../components/TravelCard';

export const Favorites: React.FC = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const data = await favoritesApi.getAll();
            setFavorites(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to load favorites');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (destinationId: number) => {
        try {
            await favoritesApi.removeByDestination(destinationId);
            // Update local state
            setFavorites(favorites.filter((fav) => fav.destination.id !== destinationId));
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message || 'Failed to remove favorite');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full size-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your favorites...</p>
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
                        <span className="mr-3">❤️</span> My Favorite Destinations
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Places you've saved for later</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {favorites.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                        <div className="text-6xl mb-4">💔</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Favorites Yet</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Browse destinations and click the heart icon to add them to your favorites!
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                        >
                            Browse Destinations
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                You have <span className="font-bold text-blue-600 dark:text-blue-400">{favorites.length}</span> favorite {favorites.length === 1 ? 'destination' : 'destinations'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map((favorite) => (
                                <TravelCard
                                    key={favorite.id}
                                    destination={favorite.destination}
                                    onRemoveFavorite={handleRemoveFavorite}
                                    isFavoritePage={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};