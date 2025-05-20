import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from '../components/BookingCard';

const UpcomingBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/bookings/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const upcoming = res.data.filter((b) => b.date >= today);
        setBookings(upcoming);
      } catch (err) {
        console.error('Failed to fetch upcoming bookings:', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="select-seats-container">
      <h2>Upcoming Bookings</h2>
      {bookings.length === 0 ? (
        <p>No upcoming bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <BookingCard key={index} booking={booking} />
        ))
      )}
    </div>
  );
};

export default UpcomingBookingsPage;
