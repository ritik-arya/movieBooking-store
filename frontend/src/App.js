import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider }         from './context/ToastContext';
import Navbar      from './components/Navbar';
import HomePage    from './pages/HomePage';
import MoviePage   from './pages/MoviePage';
import BookingPage from './pages/BookingPage';
import MyBookings  from './pages/MyBookings';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color:'#888', padding:'4rem', textAlign:'center' }}>Loading…</div>;
  return user ? children : <Navigate to="/" replace />;
}

function AppInner() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                 element={<HomePage />} />
        <Route path="/movie/:id"        element={<MoviePage />} />
        <Route path="/book/:showtimeId" element={<PrivateRoute><BookingPage /></PrivateRoute>} />
        <Route path="/my-bookings"      element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="*"                 element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AuthProvider>
  );
}
