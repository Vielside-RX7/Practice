import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from '../components/BookingCard';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]); // ✅ This line fixes the error

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/bookings/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch booking history:', err);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="select-seats-container">
      <h2>All Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking, index) => (
          <BookingCard key={index} booking={booking} />
        ))
      )}
    </div>
  );
};

export default BookingHistoryPage;
