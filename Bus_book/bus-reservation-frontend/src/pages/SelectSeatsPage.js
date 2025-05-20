import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SelectSeatsPage.css';

const SelectSeatsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bus = state?.bus;
  const travelDate = state?.date;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoadingSeats(true);
        const res = await axios.get(`http://localhost:5001/api/bookings/seats`, {
          params: { busId: bus.id, date: travelDate }
        });
        setBookedSeats(res.data.bookedSeats);
      } catch (err) {
        console.error('Error fetching booked seats', err);
      } finally {
        setLoadingSeats(false);
      }
    };
    fetchBookedSeats();
  }, [bus.id, travelDate]);

  const seatLayout = Array.from({ length: 48 }, (_, i) => `S${i + 1}`);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5001/api/bookings',
        {
          busId: bus.id,
          date: travelDate,
          seats: selectedSeats
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/booking-confirmation');
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="select-seats-container">
      <h2>Select Seats for {bus?.name} on {travelDate}</h2>

      {loadingSeats ? (
        <p>Loading seat availability...</p>
      ) : (
        <>
          <div className="bus-structure">
            <div className="bus-rows">
              {Array.from({ length: 12 }, (_, rowIdx) => {
                const rowSeats = seatLayout.slice(rowIdx * 4, rowIdx * 4 + 4);
                return (
                  <div className="seat-row" key={rowIdx}>
                    <div className="seat-pair">
                      {rowSeats.slice(0, 2).map((seat) => (
                        <button
                          key={seat}
                          className={`seat ${
                            bookedSeats.includes(seat)
                              ? 'booked'
                              : selectedSeats.includes(seat)
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() => toggleSeat(seat)}
                          disabled={bookedSeats.includes(seat)}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                    <div className="aisle-space" />
                    <div className="seat-pair">
                      {rowSeats.slice(2).map((seat) => (
                        <button
                          key={seat}
                          className={`seat ${
                            bookedSeats.includes(seat)
                              ? 'booked'
                              : selectedSeats.includes(seat)
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() => toggleSeat(seat)}
                          disabled={bookedSeats.includes(seat)}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p>🪑 Selected Seats ({selectedSeats.length}): {selectedSeats.join(', ') || 'None'}</p>
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || bookingLoading}
            >
              {bookingLoading ? 'Booking...' : 'Book Selected Seats'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectSeatsPage;
