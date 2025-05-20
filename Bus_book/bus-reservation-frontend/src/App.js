// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import SelectSeatsPage from './pages/SelectSeatsPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import BookingHistoryPage from './pages/BookingHistoryPage';

import UpcomingBookingsPage from './pages/UpcomingBookingsPage';
import PastBookingsPage from './pages/PastBookingsPage';

// Inside <Routes>

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>

<Route path="/booking-history/upcoming" element={<UpcomingBookingsPage />} />
<Route path="/booking-history/past" element={<PastBookingsPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/select-seats" element={<ProtectedRoute><SelectSeatsPage /></ProtectedRoute>} />
          <Route path="/booking-confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
<Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}



export default App;
