const db = require('../config/db');

// GET all buses
const getBuses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM buses');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch buses' });
  }
};

// ADD a bus
const addBus = async (req, res) => {
    const { name, source, destination, departure_time, fare } = req.body;
  
    if (!name || !source || !destination || !departure_time || !fare) {
      return res.status(400).json({ message: 'Missing bus data' });
    }
  
    try {
      // Insert bus
      const [result] = await db.query(
        'INSERT INTO buses (name, source, destination, departure_time, fare) VALUES (?, ?, ?, ?, ?)',
        [name, source, destination, departure_time, fare]
      );
  
      const busId = result.insertId;
  
      // Generate schedule from today to 31st July 2025
      const today = new Date();
      const endDate = new Date('2025-07-31');
      const scheduleValues = [];
  
      while (today <= endDate) {
        const formattedDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        scheduleValues.push([busId, formattedDate]);
        today.setDate(today.getDate() + 1);
      }
  
      // Insert schedule into bus_schedule
      await db.query(
        'INSERT INTO bus_schedule (bus_id, travel_date) VALUES ?',
        [scheduleValues]
      );
  
      res.status(201).json({ message: 'Bus and schedule added successfully' });
  
    } catch (err) {
      console.error('Failed to add bus or schedule:', err);
      res.status(500).json({ message: 'Failed to add bus or schedule' });
    }
  };
  
  

// UPDATE bus
const updateBus = async (req, res) => {
  const { id } = req.params;
  const { name, source, destination, departure_time, fare } = req.body;

  try {
    await db.query(
      `UPDATE buses SET name = ?, source = ?, destination = ?, departure_time = ?, fare = ? WHERE id = ?`,
      [name, source, destination, departure_time, fare, id]
    );
    res.json({ message: 'Bus updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bus' });
  }
};

// DELETE bus
const deleteBus = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM buses WHERE id = ?', [id]);
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete bus' });
  }
};

module.exports = {
  getBuses,
  addBus,
  updateBus,
  deleteBus
};
