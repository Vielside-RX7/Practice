// src/pages/BookingConfirmationPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const BookingConfirmationPage = () => {
  return (
    <div className="confirmation-container">
      <h2>🎉 Booking Confirmed!</h2>
      <p>Your ticket has been booked successfully.</p>
      <p>You can check your booking history in your profile.</p>
      <Link to="/search">
        <button>Book Another Ticket</button>
      </Link>
    </div>
  );
};

export default BookingConfirmationPage;
