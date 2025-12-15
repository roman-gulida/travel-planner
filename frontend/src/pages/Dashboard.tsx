import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinationsApi } from '../api/destinations.api';
import type { Destination } from '../types';
import { TravelCard } from '../components/TravelCard';
import { useAuth } from '../hooks/useAuth';

type Sort = 'name' | 'price' | 'country'
type Order = 'asc' | 'desc'

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();

    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter and sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortBy, setSortBy] = useState<Sort>('name');
    const [sortOrder, setSortOrder] = useState<Order>('asc');

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const data = await destinationsApi.getAll();
                setDestinations(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message || 'Failed to load destinations');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    useEffect(() => {
        const applyFiltersAndSort = () => {
            let result = [...destinations];

            // Search filter
            if (searchTerm) {
                result = result.filter(
                    (dest) =>
                        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        dest.city.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Country filter
            if (countryFilter) {
                result = result.filter((dest) =>
                    dest.country.toLowerCase().includes(countryFilter.toLowerCase())
                );
            }

            // Price filter
            if (minPrice) {
                result = result.filter((dest) => dest.price >= Number(minPrice));
            }
            if (maxPrice) {
                result = result.filter((dest) => dest.price <= Number(maxPrice));
            }

            // Sort
            result.sort((a, b) => {
                let comparison = 0;
                switch (sortBy) {
                    case 'name':
                        comparison = a.name.localeCompare(b.name);
                        break;
                    case 'price':
                        comparison = a.price - b.price;
                        break;
                    case 'country':
                        comparison = a.country.localeCompare(b.country);
                        break;
                }
                return sortOrder === 'asc' ? comparison : -comparison;
            });

            setFilteredDestinations(result);
        };

        applyFiltersAndSort();
    }, [destinations, searchTerm, countryFilter, minPrice, maxPrice, sortBy, sortOrder]);

    const clearFilters = () => {
        setSearchTerm('');
        setCountryFilter('');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('name');
        setSortOrder('asc');
    };

    const handleDeleteDestination = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
            return;
        }

        try {
            await destinationsApi.delete(id);
            alert('Destination deleted successfully!');
            // Refresh the list
            const data = await destinationsApi.getAll();
            setDestinations(data);
        } catch (err) {
            if (err instanceof Error) {
                alert(err.message || 'Failed to delete destination');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Loading destinations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header/Navigation */}
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-3xl">✈️</span>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Travel Planner</h1>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">
                                Welcome, <span className="font-semibold text-gray-900 dark:text-white">{user?.name || user?.email}</span>
                            </span>

                            <button
                                onClick={() => navigate('/favorites')}
                                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                ❤️ Favorites
                            </button>

                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                📋 Bookings
                            </button>

                            <button
                                onClick={() => navigate('/settings')}
                                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                ⚙️ Settings
                            </button>

                            {isAdmin && (
                                <>
                                    <button
                                        onClick={() => navigate('/admin/add-travel')}
                                        className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition"
                                    >
                                        ➕ Add Travel
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/bookings')}
                                        className="px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg transition"
                                    >
                                        📊 Manage
                                    </button>
                                </>
                            )}

                            <button
                                onClick={logout}
                                className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Filters Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <span className="mr-2">🔍</span> Search & Filters
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Country Filter */}
                        <input
                            type="text"
                            placeholder="Filter by country"
                            value={countryFilter}
                            onChange={(e) => setCountryFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Min Price */}
                        <input
                            type="number"
                            placeholder="Min price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Max Price */}
                        <input
                            type="number"
                            placeholder="Max price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Sort By */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as Sort)}
                                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="name">Name</option>
                                <option value="price">Price</option>
                                <option value="country">Country</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as Order)}
                            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>

                        {/* Clear Filters */}
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Destinations Grid */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Available Destinations
                        <span className="ml-2 text-blue-600 dark:text-blue-400">({filteredDestinations.length})</span>
                    </h2>

                    {filteredDestinations.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
                            <div className="text-6xl mb-4">🔍</div>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">No destinations found</p>
                            <p className="text-gray-500 dark:text-gray-500">Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredDestinations.map((dest) => (
                                <TravelCard key={dest.id} destination={dest} onDelete={handleDeleteDestination} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};