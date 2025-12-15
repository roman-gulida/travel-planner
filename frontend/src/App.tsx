import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { TravelDetails } from './pages/TravelDetails';
import { BookingForm } from './pages/BookingForm';
import { Settings } from './pages/Settings';
import { AddTravel } from './pages/AddTravel';
import { EditDestination } from './pages/EditDestination';
import { MyBookings } from './pages/MyBookings';
import { AdminBookings } from './pages/AdminBookings';
import { Favorites } from './pages/Favorites';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/destination/:id"
              element={
                <ProtectedRoute>
                  <TravelDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Favorites Route */}
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />

            {/* Admin Only Routes */}
            <Route
              path="/admin/add-travel"
              element={
                <ProtectedRoute adminOnly>
                  <AddTravel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/edit-destination/:id"
              element={
                <ProtectedRoute adminOnly>
                  <EditDestination />
                </ProtectedRoute>
              }
            />

            {/* Admin Bookings Management */}
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard or login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 - Not Found */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;