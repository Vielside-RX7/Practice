const express = require('express');
const { createBooking, getBookedSeats, getBookingHistory } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
console.log('DEBUG:', { createBooking, getBookedSeats, getBookingHistory });

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/seats', getBookedSeats);
router.get('/history', protect, getBookingHistory);

module.exports = router;
