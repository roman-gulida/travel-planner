import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Destination } from '../types';
import { useAuth } from '../hooks/useAuth';
import { favoritesApi } from '../api/favorites.api';

interface TravelCardProps {
    destination: Destination;
    onDelete?: (id: number) => void;
    onRemoveFavorite?: (destinationId: number) => void;
    isFavoritePage?: boolean;
}

export const TravelCard: React.FC<TravelCardProps> = ({
    destination,
    onDelete,
    onRemoveFavorite,
    isFavoritePage = false
}) => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const checkIfFavorite = async () => {
            try {
                const favorites = await favoritesApi.getAll();
                const isFav = favorites.some((fav) => fav.destination.id === destination.id);
                setIsFavorite(isFav);
            } catch (err) {
                if (err instanceof Error) {
                    alert(err.message || 'Failed to update favorites');
                }
            };
        }

        if (!isFavoritePage) {
            checkIfFavorite();
        } else {
            setIsFavorite(true);
        }
    }, [destination.id, isFavoritePage]);

    const handleClick = () => {
        navigate(`/destination/${destination.id}`);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/admin/edit-destination/${destination.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(destination.id);
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (favoriteLoading) return;

        setFavoriteLoading(true);

        try {
            if (isFavorite) {
                // Remove from favorites
                await favoritesApi.removeByDestination(destination.id);
                setIsFavorite(false);

                // If on favorites page, call the remove handler
                if (isFavoritePage && onRemoveFavorite) {
                    onRemoveFavorite(destination.id);
                }
            } else {
                // Add to favorites
                await favoritesApi.add(destination.id);
                setIsFavorite(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message || 'Failed to update favorites');
            }
        } finally {
            setFavoriteLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
            {/* Favorite Heart Button */}
            <button
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                className="absolute top-3 right-3 z-20 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-md hover:scale-110 transition-transform duration-200 disabled:opacity-50"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                {favoriteLoading ? '⏳' : isFavorite ? '❤️' : '🤍'}
            </button>

            {/* Image Section */}
            <div
                onClick={handleClick}
                className="relative cursor-pointer overflow-hidden"
            >
                <img
                    src={destination.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={destination.name}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Content Section */}
            <div onClick={handleClick} className="p-5 cursor-pointer">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {destination.name}
                </h3>

                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <span className="mr-1">📍</span>
                    <span className="line-clamp-1">{destination.city}, {destination.country}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${destination.price}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-500 ml-1">/ person</span>
                    </div>

                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        View Details →
                    </div>
                </div>
            </div>

            {/* Admin Buttons */}
            {isAdmin && (
                <div className="px-5 pb-5 flex gap-2">
                    <button
                        onClick={handleEdit}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        🗑️ Delete
                    </button>
                </div>
            )}
        </div>
    );
};