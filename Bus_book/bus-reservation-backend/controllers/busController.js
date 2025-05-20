// controllers/busController.js
const db = require('../config/db');

const searchBuses = async (req, res) => {
  const { source, destination, date } = req.query;

  if (!source || !destination || !date) {
    return res.status(400).json({ message: 'Missing search parameters' });
  }

  try {
    const [buses] = await db.query(
      `SELECT * FROM buses WHERE source = ? AND destination = ?`,
      [source, destination]
    );

    // You can later add logic to exclude fully booked buses for that date

    res.json(buses);
  } catch (err) {
    console.error('Bus search error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { searchBuses };
