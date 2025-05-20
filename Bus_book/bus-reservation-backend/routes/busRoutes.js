// routes/busRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // ✅ ensure this path is correct

// ✅ Route 1: Get distinct routes
router.get('/routes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT source, destination FROM buses');
    const routeMap = {};
    for (const row of rows) {
      if (!routeMap[row.source]) routeMap[row.source] = new Set();
      routeMap[row.source].add(row.destination);
    }
    const result = Object.entries(routeMap).map(([source, destSet]) => ({
      source,
      destinations: Array.from(destSet)
    }));
    res.json(result);
  } catch (err) {
    console.error('Failed to fetch routes:', err);
    res.status(500).json({ message: 'Failed to fetch routes' });
  }
});

// ✅ Route 2: Search buses
// busRoutes.js
// In routes/busRoutes.js
router.get('/search', async (req, res) => {
    const { source, destination, date } = req.query;
    console.log("Search request received with:", req.query);
  
    try {
      let query = `
        SELECT b.*
        FROM buses b
        JOIN bus_schedule s ON b.id = s.bus_id
        WHERE b.source = ? AND b.destination = ? AND s.travel_date = ?
      `;
      const values = [source, destination, date];
      const [buses] = await db.query(query, values);

      res.json(buses);
    } catch (err) {
      console.error('Search failed:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  // ✅ Route: Generate schedule for a specific bus manually (e.g. if added without schedule)
router.post('/generate-schedule/:busId', async (req, res) => {
    const { busId } = req.params;
    const startDate = new Date('2025-05-01');
    const endDate = new Date('2025-07-31');
  
    try {
      const dates = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
  
      const insertValues = dates.map(date => [busId, date.toISOString().slice(0, 10)]);
      await db.query('INSERT IGNORE INTO bus_schedule (bus_id, travel_date) VALUES ?', [insertValues]);
  
      res.status(200).json({ message: 'Schedule generated successfully for bus ID ' + busId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to generate schedule' });
    }
  });
  
  
  
  
  
  
  
  

module.exports = router;
