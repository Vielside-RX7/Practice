const db = require('../config/db');

// 1. Book seats
const createBooking = async (req, res) => {
  const { busId, date, seats } = req.body;
  const today = new Date().setHours(0, 0, 0, 0);
const selectedDate = new Date(date).setHours(0, 0, 0, 0);

if (selectedDate < today) {
  return res.status(400).json({ message: 'Cannot book for a past date' });
}

  const userId = req.user.id;

  if (!busId || !date || !seats || seats.length === 0) {
    return res.status(400).json({ message: 'Missing booking data' });
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const [result] = await conn.query(
      `INSERT INTO bookings (user_id, bus_id, date) VALUES (?, ?, ?)`,
      [userId, busId, date]
    );
    const bookingId = result.insertId;

    for (const seat of seats) {
      await conn.query(
        `INSERT INTO booked_seats (booking_id, seat_label) VALUES (?, ?)`,
        [bookingId, seat]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Booking successful', bookingId });
  } catch (err) {
    await conn.rollback();
    console.error('Booking failed:', err);
    res.status(500).json({ message: 'Booking failed' });
  } finally {
    conn.release();
  }
};

// 2. Get booked seats
const getBookedSeats = async (req, res) => {
  const { busId, date } = req.query;

  if (!busId || !date) {
    return res.status(400).json({ message: 'Missing busId or date' });
  }

  try {
    const [rows] = await db.query(
      `SELECT seat_label FROM booked_seats 
       JOIN bookings ON booked_seats.booking_id = bookings.id
       WHERE bookings.bus_id = ? AND bookings.date = ?`,
      [busId, date]
    );
    const bookedSeats = rows.map(row => row.seat_label);
    res.json({ bookedSeats });
  } catch (err) {
    console.error('Error getting booked seats:', err);
    res.status(500).json({ message: 'Failed to fetch seats' });
  }
};

// 3. Get booking history
const getBookingHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT 
         b.id AS booking_id,
         b.date,
         bs.seat_label,
         bu.name AS busName,
         bu.source AS source,
         bu.destination AS destination,
         bu.departure_time AS departure_time,
         bu.fare AS fare
       FROM bookings b
       JOIN booked_seats bs ON b.id = bs.booking_id
       JOIN buses bu ON b.bus_id = bu.id
       WHERE b.user_id = ?
       ORDER BY b.date DESC`,
      [userId]
    );

    const bookings = {};
    for (const row of rows) {
      const id = row.booking_id;
      if (!bookings[id]) {
        bookings[id] = {
          id,
          date: row.date,
          busName: row.busName,
          source: row.source,
          destination: row.destination,
          departure_time: row.departure_time,
          fare: row.fare,
          seats: []
        };
      }
      bookings[id].seats.push(row.seat_label);
    }

    res.json(Object.values(bookings));
  } catch (err) {
    console.error('❌ Error fetching booking history:', err);
    res.status(500).json({ message: 'Failed to get booking history' });
  }
};

// ✅ Correctly export all 3 functions
module.exports = {
  createBooking,
  getBookedSeats,
  getBookingHistory
};
