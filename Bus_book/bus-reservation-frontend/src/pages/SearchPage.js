// src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    date: ''
  });

  const [routes, setRoutes] = useState([]);
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/buses/routes');
        setRoutes(res.data);
        const srcs = res.data.map(r => r.source);
        setSources(srcs);
        setFilteredSources(srcs);
      } catch (err) {
        console.error('Failed to fetch routes:', err);
      }
    };
    fetchRoutes();
  }, []);

  const handleSourceInput = (value) => {
    const filtered = sources.filter(src => src.toLowerCase().includes(value.toLowerCase()));
    setFilteredSources(filtered);
    setSearchData(prev => ({ ...prev, source: value, destination: '' }));
    const route = routes.find(r => r.source === value);
    const dests = route ? route.destinations : [];
    setDestinations(dests);
    setFilteredDestinations(dests);
  };

  const handleDestinationInput = (value) => {
    const filtered = destinations.filter(dest => dest.toLowerCase().includes(value.toLowerCase()));
    setFilteredDestinations(filtered);
    setSearchData(prev => ({ ...prev, destination: value }));
  };

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const params = {
      source: searchData.source,
      destination: searchData.destination
    };
    if (searchData.date) {
      params.date = searchData.date;
    }

    try {
      const res = await axios.get('http://localhost:5001/api/buses/search', {
        params
      });
      setBuses(res.data);
      setMessage('');
    } catch (error) {
      setBuses([]);
      setMessage(error.response?.data?.message || 'Error searching for buses');
    }
  };

  const handleSelectBus = (bus) => {
    navigate('/select-seats', { state: { bus, date: searchData.date } });
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Search Buses</h2>
      <form onSubmit={handleSearch} autoComplete="off">
        {/* Source Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Source: </label>
          <input
            type="text"
            name="source"
            value={searchData.source}
            onChange={(e) => handleSourceInput(e.target.value)}
            list="source-suggestions"
            required
            style={{ width: '100%', padding: '8px' }}
          />
          <datalist id="source-suggestions">
            {filteredSources.map((src, idx) => (
              <option key={idx} value={src} />
            ))}
          </datalist>
        </div>

        {/* Destination Input */}
        {searchData.source && (
          <div style={{ marginBottom: '1rem' }}>
            <label>Destination: </label>
            <input
              type="text"
              name="destination"
              value={searchData.destination}
              onChange={(e) => handleDestinationInput(e.target.value)}
              list="destination-suggestions"
              required
              style={{ width: '100%', padding: '8px' }}
            />
            <datalist id="destination-suggestions">
              {filteredDestinations.map((dest, idx) => (
                <option key={idx} value={dest} />
              ))}
            </datalist>
          </div>
        )}

        {/* Date Picker (optional) */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Date (optional): </label>
          <input
            type="date"
            name="date"
            value={searchData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Search Button */}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Search
        </button>
      </form>

      {/* Error / Message */}
      {message && <p style={{ color: 'red' }}>{message}</p>}

      {/* Bus Results */}
      {buses.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Available Buses</h3>
          {buses.map(bus => (
            <div key={bus.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '5px' }}>
              <p><strong>{bus.name}</strong></p>
              <p>{bus.source} → {bus.destination}</p>
              <p>Time: {bus.departure_time}</p>
              <p>Fare: ₹{bus.fare}</p>
              <button onClick={() => handleSelectBus(bus)} style={{ padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none' }}>
                Select Seats
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
