import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            const updatedUser = { ...user, name: formData.name, email: formData.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setEditMode(false);
            alert('Profile updated successfully!');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                        <span className="mr-3">⚙️</span> Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                <span className="mr-2">👤</span> Profile Information
                            </h2>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition"
                                >
                                    ✏️ Edit
                                </button>
                            )}
                        </div>

                        {!editMode ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">Name</label>
                                    <p className="text-lg text-gray-900 dark:text-white font-semibold">{user?.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">Email</label>
                                    <p className="text-lg text-gray-900 dark:text-white font-semibold">{user?.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-500 mb-1">Role</label>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${user?.role === 'ADMIN'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                        {user?.role === 'ADMIN' ? '👑 Admin' : '👤 User'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Quick Links Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="mr-2">🔗</span> Quick Links
                        </h2>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/my-bookings')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                <span className="flex items-center text-gray-900 dark:text-white font-medium">
                                    <span className="mr-3 text-2xl">📋</span> My Bookings
                                </span>
                                <span className="text-gray-400">→</span>
                            </button>

                            <button
                                onClick={() => navigate('/favorites')}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                <span className="flex items-center text-gray-900 dark:text-white font-medium">
                                    <span className="mr-3 text-2xl">❤️</span> My Favorites
                                </span>
                                <span className="text-gray-400">→</span>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
};