/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [spots, setSpots] = useState([]);
  const [emptySpotsCount, setEmptySpotsCount] = useState(0);
  const [carId, setCarId] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchSpots();
    fetchEmptySpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await axios.get('http://localhost:8080/spots');
      setSpots(response.data);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }
  };

  const fetchEmptySpots = async () => {
    try {
      const response = await axios.get('http://localhost:8080/empty-spots');
      setEmptySpotsCount(response.data.emptySpots);
    } catch (error) {
      console.error('Error fetching empty spots:', error);
    }
  };

  const handleEnterCar = async () => {
    if (!carId) return;

    try {
      await axios.post('http://localhost:8080/enter', { carId });
      fetchSpots();
      fetchEmptySpots();
      setCarId('');
    } catch (error) {
      console.error('Error entering car:', error);
    }
  };

  const handleExitCar = async () => {
    if (!carId) return;

    try {
      await axios.post('http://localhost:8080/exit', { carId });

      fetchSpots();
      fetchEmptySpots();
      setCarId('');
    } catch (error) {
      console.error('Error exiting car:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>Parking Management System</h1>
      <h2>Number of Empty Spots: {emptySpotsCount}</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Car ID"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <button onClick={handleEnterCar}>Enter Car</button>
        <button onClick={handleExitCar}>Exit Car</button>
      </div>

      <h3>Parking Spots</h3>
      <ul className="spot-list">
        {spots.map((spot) => (
          <li key={spot.id} className={spot.occupied ? '100-occupied' : 'available'}>
            Spot ID: {spot.id}, Occupied: {spot.occupied ? 'Yes' : 'No'}, Car ID: {spot.carId || 'N/A'}
          </li>
        ))}
      </ul>

      <button className="toggle-mode" onClick={toggleDarkMode}>
        Toggle to {darkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
};

export default App;
*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [spots, setSpots] = useState([]);
  const [emptySpotsCount, setEmptySpotsCount] = useState(0);
  const [carId, setCarId] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchSpots();
    fetchEmptySpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const response = await axios.get('http://localhost:8080/spots');
      setSpots(response.data);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }
  };

  const fetchEmptySpots = async () => {
    try {
      const response = await axios.get('http://localhost:8080/empty-spots');
      setEmptySpotsCount(response.data.emptySpots);
    } catch (error) {
      console.error('Error fetching empty spots:', error);
    }
  };

  const handleEnterCar = async () => {
    if (!carId) return;

    try {
      const response = await axios.post('http://localhost:8080/enter', { carId });
      fetchSpots();
      fetchEmptySpots();
      setCarId('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
          alert('Error: ' + error.response.data.error); // Show warning for duplicate Car ID
      } else {
          console.error('Error entering car:', error);
      }
    }
  };

  const handleExitCar = async () => {
    if (!carId) return;

    try {
      await axios.post('http://localhost:8080/exit', { carId });
      fetchSpots();
      fetchEmptySpots();
      setCarId('');
    } catch (error) {
      console.error('Error exiting car:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <h1>Parking Management System</h1>
      <h2>Number of Empty Spots: {emptySpotsCount}</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Car ID"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        />
        <button onClick={handleEnterCar}>Enter Car</button>
        <button onClick={handleExitCar}>Exit Car</button>
      </div>

      <button className="toggle-mode" onClick={toggleDarkMode}>
        Toggle to {darkMode ? 'Light' : 'Dark'} Mode
      </button>

      <h3>Parking Spots</h3>
      <ul className="spot-list">
        {spots.map((spot) => (
          <li key={spot.id} className={spot.occupied ? '100-occupied' : 'available'}>
            Spot ID: {spot.id}, Occupied: {spot.occupied ? 'Yes' : 'No'}, Car ID: {spot.carId || 'N/A'}
          </li>
        ))}
      </ul>

      
    </div>
  );
};

export default App;
