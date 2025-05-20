// src/components/BookingCard.js
import React from 'react';
import './BookingCard.css';

const BookingCard = ({ booking }) => {
  const formattedDate = new Date(booking.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = booking.departure_time?.slice(0, 5); // e.g., '08:00'
  console.log('📦 Booking data:', booking);

  return (
    <div className="booking-card">
  <h3>{booking.busName || booking.bus_name || 'Unknown Bus'}</h3>

  <p><strong>Route:</strong> {booking.source || '-'} → {booking.destination || '-'}</p>
  <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  })}</p>
  {booking.departure_time && (
    <p><strong>Departure:</strong> {booking.departure_time.slice(0, 5)}</p>
  )}
  <p><strong>Seats:</strong> {booking.seats?.join(', ')}</p>
  {booking.fare && <p><strong>Fare:</strong> ₹{booking.fare}</p>}
</div>

  );
};

export default BookingCard;
