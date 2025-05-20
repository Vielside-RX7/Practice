import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [newBus, setNewBus] = useState({
    name: '',
    source: '',
    destination: '',
    departure_time: '',
    fare: ''
  });
  const [editingBusId, setEditingBusId] = useState(null);

  const fetchBuses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/buses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBuses(res.data);
    } catch (err) {
      console.error('Failed to fetch buses:', err);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleChange = (e) => {
    setNewBus({ ...newBus, [e.target.name]: e.target.value });
  };

  const handleAddBus = async () => {
    try {
      await axios.post('http://localhost:5001/api/admin/buses', newBus, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewBus({ name: '', source: '', destination: '', departure_time: '', fare: '' });
      fetchBuses();
    } catch (err) {
      console.error('Failed to add bus:', err);
    }
  };

  const handleDeleteBus = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/admin/buses/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchBuses();
    } catch (err) {
      console.error('Failed to delete bus:', err);
    }
  };

  const handleEditClick = (bus) => {
    setEditingBusId(bus.id);
    setNewBus({
      name: bus.name,
      source: bus.source,
      destination: bus.destination,
      departure_time: bus.departure_time,
      fare: bus.fare
    });
  };

  const handleUpdateBus = async () => {
    try {
      await axios.put(`http://localhost:5001/api/admin/buses/${editingBusId}`, newBus, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditingBusId(null);
      setNewBus({ name: '', source: '', destination: '', departure_time: '', fare: '' });
      fetchBuses();
    } catch (err) {
      console.error('Failed to update bus:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <h3>{editingBusId ? 'Edit Bus' : 'Add New Bus'}</h3>
      <input name="name" placeholder="Bus Name" value={newBus.name} onChange={handleChange} />
      <input name="source" placeholder="Source" value={newBus.source} onChange={handleChange} />
      <input name="destination" placeholder="Destination" value={newBus.destination} onChange={handleChange} />
      <input name="departure_time" type="time" value={newBus.departure_time} onChange={handleChange} />
      <input name="fare" type="number" placeholder="Fare" value={newBus.fare} onChange={handleChange} />
      <button onClick={editingBusId ? handleUpdateBus : handleAddBus}>
        {editingBusId ? 'Update Bus' : 'Add Bus'}
      </button>

      <h3>All Buses</h3>
      <ul>
        {buses.map((bus) => (
          <li key={bus.id} className="bus-list-item">
            <p>
              <strong>{bus.name}</strong> – {bus.source} → {bus.destination} at {bus.departure_time} ₹{bus.fare}
            </p>
            <button onClick={() => handleEditClick(bus)}>Edit</button>
            <button onClick={() => handleDeleteBus(bus.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
