import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from '../components/BookingCard';

const PastBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/bookings/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const past = res.data.filter((b) => b.date < today);
        setBookings(past);
      } catch (err) {
        console.error('Failed to fetch past bookings:', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="select-seats-container">
      <h2>Past Bookings</h2>
      {bookings.length === 0 ? (
        <p>No past bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <BookingCard key={index} booking={booking} />
        ))
      )}
    </div>
  );
};

export default PastBookingsPage;
